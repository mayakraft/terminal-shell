import ear from "rabbit-ear";
import MakeShaderProgram from "../WebGL/MakeShaderProgram";
import fragmentSimpleV1 from "./simple-v1.frag?raw";
import vertexSimpleV1 from "./simple-v1.vert?raw";
import vertexThickEdgesV1 from "./thick-edges-v1.vert?raw";
// import vertexThickEdges3 from "../WebGL/thickEdges3.vert?raw";
// import fragmentSimple3 from "../WebGL/simple3.frag?raw";

const triangulate = (indices) => Array.from(Array(indices.length - 2))
	.map((_, i) => [indices[0], indices[i + 1], indices[i + 2]]);

const triangulateConvexFacesVertices = ({ faces_vertices }) => faces_vertices
	.flatMap(vertices => vertices.length < 4
		? [vertices]
		: triangulate(vertices));

const assignment_colors = {
	B: [0.33, 0.33, 0.33],  b: [0.33, 0.33, 0.33],
	V: [0.21, 0.39, 0.59],  v: [0.21, 0.39, 0.59],
	M: [0.73, 0.25, 0.14],  m: [0.73, 0.25, 0.14],
	F: [0.2, 0.2, 0.2],     f: [0.2, 0.2, 0.2],
	U: [0.2, 0.2, 0.2],     u: [0.2, 0.2, 0.2],
};

const makeEdgesVertexArrays = (gl, graph, program) => {
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
		{ location: gl.getAttribLocation(program, "position"),
			buffer: gl.createBuffer(),
			length: vertices_coords[0].length,
			data: new Float32Array(vertices_coords.flat()) },
		{ location: gl.getAttribLocation(program, "v_color"),
			buffer: gl.createBuffer(),
			length: vertices_color[0].length,
			data: new Float32Array(vertices_color.flat()) },
		{ location: gl.getAttribLocation(program, "edge_vector"),
			buffer: gl.createBuffer(),
			length: verticesEdgesVector[0].length,
			data: new Float32Array(verticesEdgesVector.flat()) },
		{ location: gl.getAttribLocation(program, "vertex_vector"),
			buffer: gl.createBuffer(),
			length: verticesVector[0].length,
			data: new Float32Array(verticesVector.flat()) },
	];
};

const makeEdgesElementArrays = (gl, graph) => {
	const edgesTriangles = graph.edges_vertices
		.map((_, i) => i * 4)
		.flatMap(i => [i + 0, i + 1, i + 2, i + 2, i + 3, i + 0]);
	return [{
		mode: gl.TRIANGLES,
		buffer: gl.createBuffer(),
		data: new Uint16Array(edgesTriangles),
	}];
};

const makeFacesVertexArrays = (gl, graph, program) => {
	const vertices_color = graph.vertices_coords.map(() => [0.11, 0.11, 0.11]);
	return [
		{ location: gl.getAttribLocation(program, "position"),
			buffer: gl.createBuffer(),
			length: graph.vertices_coords[0].length,
			data: new Float32Array(graph.vertices_coords.flat()) },
		{ location: gl.getAttribLocation(program, "v_color"),
			buffer: gl.createBuffer(),
			length: vertices_color[0].length,
			data: new Float32Array(vertices_color.flat()) },
	];
};

const makeFacesElementArrays = (gl, graph) => [{
	mode: gl.TRIANGLES,
	buffer: gl.createBuffer(),
	data: new Uint16Array(triangulateConvexFacesVertices(graph).flat()),
}];

const WebGLCreasePattern = (graph, gl, version = 1) => {
	const shaders = [];
	switch (version) {
		case 1: shaders.push(
				{ program: MakeShaderProgram(gl, vertexSimpleV1, fragmentSimpleV1) },
				{ program: MakeShaderProgram(gl, vertexThickEdgesV1, fragmentSimpleV1) },
			); break;
		case 2: shaders.push(
				{ program: MakeShaderProgram(gl, vertexSimpleV1, fragmentSimpleV1) },
				{ program: MakeShaderProgram(gl, vertexThickEdgesV1, fragmentSimpleV1)},
			); break;
	}
	shaders[0].vertexArrays = makeFacesVertexArrays(gl, graph, shaders[0].program);
	shaders[1].vertexArrays = makeEdgesVertexArrays(gl, graph, shaders[1].program);
	shaders[0].elementArrays = makeFacesElementArrays(gl, graph);
	shaders[1].elementArrays = makeEdgesElementArrays(gl, graph);
	return shaders;
};

export default WebGLCreasePattern;
