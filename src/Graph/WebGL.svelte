<script>
	import ear from "rabbit-ear";
	import { onMount, onDestroy } from "svelte";
	import MakeShaderProgram from "./WebGL/MakeShaderProgram";
	import { initializeWebGL } from "./WebGL/Helpers";
	import {
		makePerspectiveCamera,
		makeOrthographicCamera,
	} from "./WebGL/camera";
	import vertexSimple from "./WebGL/simple.vert?raw";
	import vertexThickEdges from "./WebGL/thickEdges.vert?raw";
	import fragmentSimple from "./WebGL/simple.frag?raw";
	// import vertexThickEdges3 from "./WebGL/thickEdges3.vert?raw";
	// import fragmentSimple3 from "./WebGL/simple3.frag?raw";

	export let origami = {};
	export let strokeWidth = 0.0025;
	let { innerWidth, innerHeight } = window;

	// webgl, hold onto these so we can dealloc them later
	let webGL;
	let facesProgram, edgesProgram;
	let animationID;
	let edgesVertexArrays, facesVertexArrays;
	let edgesElementArrays, facesElementArrays;

	/**
	 * @description Create a modified graph which contains vertices_coords and faces_vertices
	 * but that for every face, vertices_coords has been duplicated so that faces
	 * do not share vertices.
	 * @param {FOLD} graph a FOLD graph
	 * @returns {FOLD} a new FOLD graph with exploded faces
	 * @linkcode Origami ./src/graph/explodeFaces.js 15
	 */
	// const explodeEdges = (graph) => {
	// 	const vertices_coords = graph.edges_vertices
	// 		.flatMap(edge => edge.map(v => graph.vertices_coords[v]));
	// 	let i = 0;
	// 	const edges_vertices = graph.edges_vertices
	// 		.map(edge => edge.map(v => i++));
	// 	// deep copy vertices coords
	// 	return {
	// 		vertices_coords: JSON.parse(JSON.stringify(vertices_coords)),
	// 		edges_vertices,
	// 	};
	// };

	const triangulate = (indices) => Array.from(Array(indices.length - 2))
		.map((_, i) => [indices[0], indices[i + 1], indices[i + 2]]);

	const triangulateConvexFacesVertices = ({ faces_vertices }) => faces_vertices
		.flatMap(vertices => vertices.length < 4
			? [vertices]
			: triangulate(vertices));

	const assignment_colors = {
		B: [0.3, 0.3, 0.3],     b: [0.3, 0.3, 0.3],
		V: [0.21, 0.39, 0.59],  v: [0.21, 0.39, 0.59],
		M: [0.73, 0.25, 0.14],  m: [0.73, 0.25, 0.14],
		F: [0.2, 0.2, 0.2],     f: [0.2, 0.2, 0.2],
		U: [0.2, 0.2, 0.2],     u: [0.2, 0.2, 0.2],
	};

	const drawEdges = (gl, graph, matrix) => {
		gl.useProgram(edgesProgram);
		gl.uniform1f(gl.getUniformLocation(edgesProgram, "thickness"), strokeWidth / 2);
		gl.uniformMatrix4fv(gl.getUniformLocation(edgesProgram, "matrix"), false, matrix);

		edgesVertexArrays.forEach(el => {
			gl.bindBuffer(gl.ARRAY_BUFFER, el.buffer);
			gl.bufferData(gl.ARRAY_BUFFER, el.data, gl.STATIC_DRAW);
			gl.vertexAttribPointer(el.location, el.length, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(el.location);
		});
		// gl.linkProgram(edgesProgram);
		edgesElementArrays.forEach(el => {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, el.buffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, el.data, gl.STATIC_DRAW);
			gl.drawElements(
				el.mode, // GL.TRIANGLES for example
				el.data.length,
				gl.UNSIGNED_SHORT,
				el.buffer
			);
		});
	};

	const drawFaces = (gl, graph, matrix) => {
		gl.useProgram(facesProgram);
		gl.uniformMatrix4fv(gl.getUniformLocation(facesProgram, "matrix"), false, matrix);

		facesVertexArrays.forEach(el => {
			gl.bindBuffer(gl.ARRAY_BUFFER, el.buffer);
			gl.bufferData(gl.ARRAY_BUFFER, el.data, gl.STATIC_DRAW);
			gl.vertexAttribPointer(el.location, el.length, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(el.location);
		});
		// gl.linkProgram(facesProgram);
		facesElementArrays.forEach(el => {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, el.buffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, el.data, gl.STATIC_DRAW);
			gl.drawElements(
				el.mode, // GL.TRIANGLES for example
				el.data.length,
				gl.UNSIGNED_SHORT,
				el.buffer
			);
		});
	};

	const makeEdgesVertexArrays = (gl, graph) => {
		const vertices_coords = graph.edges_vertices
			.flatMap(edge => edge
				.map(v => graph.vertices_coords[v]))
				.flatMap(coord => [coord, coord]);
		const edgesVector = ear.graph.makeEdgesVector(graph);
		const edgesOrigin = graph.edges_vertices.map(edge => graph.vertices_coords[edge[0]]);
		const vertices_color = graph.edges_assignment
			.flatMap(a => [assignment_colors[a], assignment_colors[a], assignment_colors[a], assignment_colors[a]]);
		const verticesEdgesVector = edgesVector
			.flatMap(el => [el, el, el, el]);
		const verticesVector = graph.edges_vertices
			.flatMap(() => [[1,0], [-1,0], [-1,0], [1,0]]);

		return [
			{ location: gl.getAttribLocation(edgesProgram, "position"),
				buffer: gl.createBuffer(),
				length: vertices_coords[0].length, // length means the length of an individual point
				data: new Float32Array(vertices_coords.flat()) },
			{ location: gl.getAttribLocation(edgesProgram, "v_color"),
				buffer: gl.createBuffer(),
				length: vertices_color[0].length,
				data: new Float32Array(vertices_color.flat()) },
			{ location: gl.getAttribLocation(edgesProgram, "edge_vector"),
				buffer: gl.createBuffer(),
				length: verticesEdgesVector[0].length,
				data: new Float32Array(verticesEdgesVector.flat()) },
			{ location: gl.getAttribLocation(edgesProgram, "vertex_vector"),
				buffer: gl.createBuffer(),
				length: verticesVector[0].length,
				data: new Float32Array(verticesVector.flat()) },
		];
	};

	const makeFacesVertexArrays = (gl, graph) => {
		const vertices_color = graph.vertices_coords.map(() => [0.11, 0.11, 0.11]);
		return [
			{ location: gl.getAttribLocation(facesProgram, "position"),
				buffer: gl.createBuffer(),
				length: graph.vertices_coords[0].length,
				data: new Float32Array(graph.vertices_coords.flat()) },
			{ location: gl.getAttribLocation(facesProgram, "v_color"),
				buffer: gl.createBuffer(),
				length: vertices_color[0].length,
				data: new Float32Array(vertices_color.flat()) },
		];
	};

	const makeEdgesElementArrays = (gl, graph) => {
		const edgesTriangles = graph.edges_vertices
			.map((_, i) => i * 4)
			.flatMap(i => [i + 0, i + 1, i + 2, i + 2, i + 3, i + 0]);
		return [
			{
				mode: gl.TRIANGLES,
				buffer: gl.createBuffer(),
				data: new Uint16Array(edgesTriangles),
			}
		];
	};
	const makeFacesElementArrays = (gl, graph) => [
		{
			mode: gl.TRIANGLES,
			buffer: gl.createBuffer(),
			data: new Uint16Array(triangulateConvexFacesVertices(graph).flat()),
		}
	];

	let frameNum = 0;

	const draw = (gl, graph, size) => {
		// const matrix = makeOrthographicCamera(...size);
		const matrix = makePerspectiveCamera(...size, frameNum);
		drawFaces(gl, graph, matrix);
		drawEdges(gl, graph, matrix);
		frameNum += 1;
	};

	const redrawCanvas = (graph, w, h) => {
		const element = document.querySelector("canvas");
		if (!element || !webGL) { return; }
		edgesVertexArrays = makeEdgesVertexArrays(webGL, graph);
		facesVertexArrays = makeFacesVertexArrays(webGL, graph);
		edgesElementArrays = makeEdgesElementArrays(webGL, graph);
		facesElementArrays = makeFacesElementArrays(webGL, graph);
		draw(webGL, graph, [element.clientWidth, element.clientHeight]);
	};

	$: redrawCanvas(origami, innerWidth, innerHeight);

	onMount(() => {
		const element = document.querySelector("canvas");
		const { gl, version } = initializeWebGL(element);
		if (!gl) { return; }
		switch (version) {
			case 1:
				facesProgram = MakeShaderProgram(gl, vertexSimple, fragmentSimple);
				edgesProgram = MakeShaderProgram(gl, vertexThickEdges, fragmentSimple);
				break;
			case 2:
				facesProgram = MakeShaderProgram(gl, vertexSimple, fragmentSimple);
				edgesProgram = MakeShaderProgram(gl, vertexThickEdges, fragmentSimple);
				break;
		}
		webGL = gl;
		redrawCanvas(origami);
		// draw(gl, origami, [element.clientWidth, element.clientHeight]);

		const animate = () => {
			animationID = window.requestAnimationFrame(animate);
			draw(gl, origami, [element.clientWidth, element.clientHeight]);
		};
		animate();
	});

	onDestroy(() => {
		// dealloc webgl
		webGL.deleteProgram(facesProgram);
		webGL.deleteProgram(edgesProgram);
		window.cancelAnimationFrame(animationID);
	});

</script>

<svelte:window 
	bind:innerWidth
	bind:innerHeight
/>

<div class="graph">
	<canvas></canvas>
</div>

<style>
	canvas {
		width: 100%;
		height: 100%;
	}
	.graph {
		grid-column: 2/3;
		grid-row: 1/4;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
