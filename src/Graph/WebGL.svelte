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
	let { innerWidth, innerHeight } = window;

	// webgl variables, hold onto these so we can dealloc them later
	let gl;
	let cpProgram, edgesProgram;
	let animationID;

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

	// const createUniformBuffer = (gl, program, uniformName, values) => {
	// 	const buffer = gl.createBuffer();
	// 	const uniformLocation = gl.getUniformLocation(program, uniformName);
	// 	// console.log("uniform", uniformName, uniformLocation);
	// 	gl.enableVertexAttribArray(uniformLocation);
	// 	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	// 	gl.vertexAttribPointer(
	// 		uniformLocation,
	// 		values[0].length,
	// 		gl.FLOAT,
	// 		false, // Normalize
	// 		0, // Stride
	// 		0, // Offset
	// 	);
	// 	return buffer;
	// }

	const createAttributeBuffer = (gl, program, attributeName, values) => {
		const buffer = gl.createBuffer();
		const attributeLocation = gl.getAttribLocation(program, attributeName);
		// console.log("attribute", attributeName, attributeLocation);
		gl.enableVertexAttribArray(attributeLocation);
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.vertexAttribPointer(
			attributeLocation,
			values[0].length,
			gl.FLOAT,
			false, // Normalize
			0, // Stride
			0, // Offset
		);
		return buffer;
	};

	const assignment_colors = {
		B: [0.3, 0.3, 0.3],     b: [0.3, 0.3, 0.3],
		V: [0.21, 0.39, 0.59],  v: [0.21, 0.39, 0.59],
		M: [0.73, 0.25, 0.14],  m: [0.73, 0.25, 0.14],
		F: [0.2, 0.2, 0.2],     f: [0.2, 0.2, 0.2],
		U: [0.2, 0.2, 0.2],     u: [0.2, 0.2, 0.2],
	};

	const drawEdges = (matrix) => {
		gl.useProgram(edgesProgram);

		// const ext = gl.getExtension('OES_texture_float');

		// const texture = gl.createTexture();
		// gl.bindTexture(gl.TEXTURE_2D, texture);

		// // lookup uniforms
		// var textureLocation = gl.getUniformLocation(edgesProgram, "u_texture");

		// // fill texture with 1x3 pixels
		// const level = 0;
		// const internalFormat = gl.RGBA; // I've also tried to work with gl.LUMINANCE
		// //   but it feels harder to debug
		// const width = 1;
		// const height = 3;
		// const border = 0;
		// // const type = gl.UNSIGNED_BYTE;
		// const type = gl.FLOAT;
		// // const data = new Uint8Array([
		// // 	// R,   G,   B, A (unused)    // : 'texel' index (?)
		// // 	64, 0, 0, 0, // : 0
		// // 	0, 128, 0, 0, // : 1
		// // 	0, 0, 255, 0, // : 2
		// // ]);
		// const data = new Float32Array([
		// 	// R,   G,   B, A (unused)    // : 'texel' index (?)
		// 	64, 0, 0, 0, // : 0
		// 	0, 128, 0, 0, // : 1
		// 	0, 0, 255, 0, // : 2
		// ]);
		// const alignment = 1; // should be uneccessary for this texture, but 
		// // gl.pixelStorei(gl.UNPACK_ALIGNMENT, alignment); //   I don't think this is hurting
		// // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.FLOAT, image);
		// gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border,
		// internalFormat, type, data);

		// // set the filtering so we don't need mips and it's not filtered
		// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		// gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);



		// // Tell the shader to use texture unit 0 for u_texture
		// gl.activeTexture(gl.TEXTURE0);     // added this and following line to be extra sure which texture is being used...
		// gl.bindTexture(gl.TEXTURE_2D, texture);
		// gl.uniform1i(textureLocation, 0);


		// const exploded = explodeEdges(origami);
		const vertices_coords = origami.edges_vertices
			.flatMap(edge => edge
				.map(v => origami.vertices_coords[v]))
				.flatMap(coord => [coord, coord]);
		const edgesVector = ear.graph.makeEdgesVector(origami);
		// const edgesVector = vertices_coords.map(v => [0.01 * Math.random(), 0.01 * Math.random()]);
		const edgesOrigin = origami.edges_vertices.map(edge => origami.vertices_coords[edge[0]]);
		const vertices_color = origami.edges_assignment
			.flatMap(a => [assignment_colors[a], assignment_colors[a], assignment_colors[a], assignment_colors[a]]);
		// const verticesCorner = vertices_coords.map((_, i) => i % 4);
		const verticesEdgesVector = edgesVector
			.flatMap(el => [el, el, el, el]);
		const verticesVector = origami.edges_vertices
			.flatMap(() => [[1,0], [-1,0], [-1,0], [1,0]]);
		// const nudge = vertices_coords.map(v => [0.01 * Math.random(), 0.01 * Math.random()]);

		gl.uniform1f(gl.getUniformLocation(edgesProgram, "thickness"), 0.0025);
		gl.uniformMatrix4fv(gl.getUniformLocation(edgesProgram, "matrix"), false, matrix);
		const positionBuffer = createAttributeBuffer(gl, edgesProgram, "position", vertices_coords);
		const colorBuffer = createAttributeBuffer(gl, edgesProgram, "v_color", vertices_color);
		const edgesVectorBuffer = createAttributeBuffer(gl, edgesProgram, "edge_vector", verticesEdgesVector);
		const verticesVectorBuffer = createAttributeBuffer(gl, edgesProgram, "vertex_vector", verticesVector);
		// const nudgeBuffer = createAttributeBuffer(gl, edgesProgram, "nudge", nudge);

		// set data
		gl.bindBuffer(gl.UNIFORM_BUFFER, positionBuffer);
		gl.bufferData(gl.UNIFORM_BUFFER, new Float32Array(vertices_coords.flat()), gl.STATIC_DRAW);
		gl.bindBuffer(gl.UNIFORM_BUFFER, colorBuffer);
		gl.bufferData(gl.UNIFORM_BUFFER, new Float32Array(vertices_color.flat()), gl.STATIC_DRAW);
		gl.bindBuffer(gl.UNIFORM_BUFFER, edgesVectorBuffer);
		gl.bufferData(gl.UNIFORM_BUFFER, new Float32Array(verticesEdgesVector.flat()), gl.STATIC_DRAW);
		gl.bindBuffer(gl.UNIFORM_BUFFER, verticesVectorBuffer);
		gl.bufferData(gl.UNIFORM_BUFFER, new Float32Array(verticesVector.flat()), gl.STATIC_DRAW);
		// gl.bindBuffer(gl.UNIFORM_BUFFER, nudgeBuffer);
		// gl.bufferData(gl.UNIFORM_BUFFER, new Float32Array(nudge.flat()), gl.STATIC_DRAW);

		const edgesTriangles = origami.edges_vertices
			.map((_, i) => i * 4)
			.flatMap(i => [i + 0, i + 1, i + 2, i + 2, i + 3, i + 0]);

		// console.log("vertices_coords", vertices_coords);
		// console.log("vertices_color", vertices_color);
		// console.log("edgesVector", edgesVector);
		// console.log("edgesTriangles", edgesTriangles);
		// console.log("verticesEdgesVector", verticesEdgesVector);
		// console.log("verticesVector", verticesVector);

		const triangleVerticesData = new Uint16Array(edgesTriangles);

		const indicesBuffer = gl.createBuffer();

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleVerticesData, gl.STATIC_DRAW);
		gl.drawElements(
			gl.TRIANGLES,
			triangleVerticesData.length,
			gl.UNSIGNED_SHORT,
			indicesBuffer
		);
	};

	const drawFaces = (matrix) => {
		const vertices_coords = origami.vertices_coords;
		const vertices_color = vertices_coords.map(() => [0.11, 0.11, 0.11]);

		gl.useProgram(cpProgram);

		gl.uniformMatrix4fv(gl.getUniformLocation(cpProgram, "matrix"), false, matrix);
		const positionBuffer = createAttributeBuffer(gl, cpProgram, "position", vertices_coords);
		const colorBuffer = createAttributeBuffer(gl, cpProgram, "v_color", vertices_color);

		// set vertex data
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices_coords.flat()), gl.STATIC_DRAW);
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices_color.flat()), gl.STATIC_DRAW);

		// set index data
		const indicesBuffer = gl.createBuffer();
		const triangleVerticesData = new Uint16Array(triangulateConvexFacesVertices(origami).flat());
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleVerticesData, gl.STATIC_DRAW);
		gl.drawElements(
			gl.TRIANGLES,
			triangleVerticesData.length,
			gl.UNSIGNED_SHORT,
			indicesBuffer
		);
	};

	let frameNum = 0;

	const draw = (canvasWidth, canvasHeight) => {
		const matrix = makeOrthographicCamera(canvasWidth, canvasHeight);
		// const matrix = makePerspectiveCamera(canvasWidth, canvasHeight, frameNum);
		drawFaces(matrix);
		drawEdges(matrix);
		frameNum += 1;
	};

	const resizeCanvas = (w, h) => {
		const element = document.querySelector("canvas");
		if (!element || !cpProgram) { return; }
		// if (!element || !cpProgram || !edgesProgram) { return; }
		draw(element.clientWidth, element.clientHeight);
	};

	$: resizeCanvas(innerWidth, innerHeight);

	onMount(() => {
		const element = document.querySelector("canvas");
		gl = initializeWebGL(element);
		cpProgram = MakeShaderProgram(gl, vertexSimple, fragmentSimple);
		edgesProgram = MakeShaderProgram(gl, vertexThickEdges, fragmentSimple);
		draw(element.clientWidth, element.clientHeight);

		const animate = () => {
			animationID = window.requestAnimationFrame(animate);
			draw(element.clientWidth, element.clientHeight);
		};
		animate();
	});

	onDestroy(() => {
		// dealloc webgl
		gl.deleteProgram(cpProgram);
		gl.deleteProgram(edgesProgram);
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
		grid-row: 1/3;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
