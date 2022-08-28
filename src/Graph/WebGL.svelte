<script>
	import ear from "rabbit-ear";
	import { onMount, onDestroy } from "svelte";
	import WebGLCreasePattern from "./FoldToWebGL/WebGLCreasePattern";
	import WebGLFoldedForm from "./FoldToWebGL/WebGLFoldedForm";

	export let origami = {};
	let origamiBounds;
	export let webGLPerspective = "orthographic";
	export let viewClass = "creasePattern";
	export let strokeWidth = 0.0025;
	let dragSpeed = 8.0;
	let { innerWidth, innerHeight } = window;

	// webgl, hold onto these so we can dealloc them later
	let webGL, webGLVersion;
	let animationID;
	let shaders = [];
	let canvas;
	let projectionMatrix = [...ear.math.identity4x4];
	let viewMatrix = [...ear.math.identity4x4];
	let modelMatrix = [...ear.math.identity4x4];

	const drawShader = (gl, shader, uniforms) => {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.useProgram(shader.program);
		// set uniforms
		const uniformCount = gl.getProgramParameter(shader.program, gl.ACTIVE_UNIFORMS);
		for (let i = 0; i < uniformCount; i += 1) {
			const uniformName = gl.getActiveUniform(shader.program, i).name;
			const uniform = uniforms[uniformName];
			if (uniform) {
				uniform.set(gl.getUniformLocation(shader.program, uniformName), uniform.value);
			}
		}
		// set vertex arrays
		shader.vertexArrays.forEach(el => {
			gl.bindBuffer(gl.ARRAY_BUFFER, el.buffer);
			gl.bufferData(gl.ARRAY_BUFFER, el.data, gl.STATIC_DRAW);
			gl.vertexAttribPointer(el.location, el.length, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(el.location);
		});
		// gl.linkProgram(shader.program);
		// draw elements
		shader.elementArrays.forEach(el => {
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

	let frameNum = 0;

	const draw = (gl) => {
		const matrix = ear.math
			.multiplyMatrices4(ear.math
				.multiplyMatrices4(projectionMatrix, viewMatrix), modelMatrix);
		// recalculate any uniforms
		const uniforms = {
			matrix: {
				set: (i, value) => gl.uniformMatrix4fv(i, false, value),
				value: matrix,
			},
			projectionMatrix: {
				set: (i, value) => gl.uniformMatrix4fv(i, false, value),
				value: projectionMatrix,
			},
			modelViewMatrix: {
				set: (i, value) => gl.uniformMatrix4fv(i, false, value),
				value: ear.math.multiplyMatrices4(viewMatrix, modelMatrix),
			},
			thickness: {
				set: (i, value) => gl.uniform1f(i, value),
				value: strokeWidth / 2,
			},
		}
		shaders.forEach(shader => drawShader(gl, shader, uniforms));
		// frameNum += 1;
	};

	const redrawCanvas = () => {
		if (!canvas || !webGL) { return; }
		rebuildProjection(webGLPerspective, origami);
		draw(webGL, [canvas.clientWidth, canvas.clientHeight]);
	};

	const rebuildProjection = () => {
		const moreZoom = 1.5; // need to adjust based on canvas size
		if (!canvas || !origami) { return; }
		const canvasDimensions = [canvas.clientWidth, canvas.clientHeight];
		const vmin = Math.min(...canvasDimensions) / 1.05;
		const half = [0, 1].map(i => ((canvasDimensions[i] - vmin) / vmin) / 2);
		origamiBounds = ear.graph.getBoundingBox(origami);
		const scale = Math.max(...origamiBounds.span) * moreZoom;
		const center = ear.math.resize(3, ear.math.midpoint(origamiBounds.min, origamiBounds.max));
		// projection matrix
		projectionMatrix = webGLPerspective === "orthographic"
			? ear.math.makeOrthographicMatrix4(1 + half[1], 1 + half[0], -half[1], -half[0], -10, 10)
			: ear.math.makePerspectiveMatrix4(Math.PI / 4, canvasDimensions[0] / canvasDimensions[1], 0.01, 100);
		// view matrix
		const lookAtMatrix = ear.math.makeLookAtMatrix4([0, 0, 1], [0, 0, 0], [0, 1, 1]);
		viewMatrix = ear.math.invertMatrix4(lookAtMatrix);
		// model matrix
		const scalePositionMatrix = [scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, scale, 0, ...center, 1];
		modelMatrix = ear.math.invertMatrix4(scalePositionMatrix);
	};

	const rebuildShaders = (graph) => {
		if (!webGL) { return; }
		deallocShaders(webGL);
		shaders = [];
		origamiBounds = ear.graph.getBoundingBox(graph);
		switch(viewClass) {
			case "creasePattern": shaders.push(...WebGLCreasePattern(graph, webGL, webGLVersion));
				break;
			case "foldedForm": shaders.push(...WebGLFoldedForm(graph, webGL, webGLVersion));
				break;
			default: break;
		}
	};

	const deallocShaders = (gl) => {
		shaders.forEach(shader => {
			shader.vertexArrays.forEach(vert => gl.deleteBuffer(vert.buffer));
			shader.elementArrays.forEach(elements => gl.deleteBuffer(elements.buffer));
			webGL.deleteProgram(shader.program);
		});
		while (shaders.length) { shaders.pop(); }
		// gl.deleteTexture(someTexture);
		// gl.deleteRenderbuffer(someRenderbuffer);
		// gl.deleteFramebuffer(someFramebuffer);
	};

	const rebuildAll = () => {
		rebuildShaders(origami);
		redrawCanvas();
	};

	$: redrawCanvas(innerWidth, innerHeight, webGLPerspective, origami);
	$: rebuildAll(origami, viewClass);
	// $: rebuildProjection(webGLPerspective, origami);

	onMount(() => {
		canvas = document.querySelector("canvas");
		const { gl, version } = ear.webgl.initialize(canvas, 1);
		webGL = gl;
		webGLVersion = version;
		if (!webGL) { return; }

		gl.enable(gl.DEPTH_TEST);

		// rebuildProjection(webGLPerspective, origami);
		rebuildShaders(origami, viewClass);
		redrawCanvas(origami);

		// const animate = () => {
		// 	animationID = window.requestAnimationFrame(animate);
		// 	draw(webGL, [canvas.clientWidth, canvas.clientHeight]);
		// };
		// animate();

		draw(webGL, [canvas.clientWidth, canvas.clientHeight]);

		canvas.addEventListener("mousedown", onPress, false);
		canvas.addEventListener("mousemove", onMove, false);
		canvas.addEventListener("mouseup", onRelease, false);
		canvas.addEventListener("wheel", onScroll, false);
		canvas.addEventListener("ontouchstart", onPress, false);
		canvas.addEventListener("ontouchmove", onMove, false);
		canvas.addEventListener("ontouchend", onRelease, false);

	});

	onDestroy(() => {
		canvas = null;
		// dealloc webgl
		deallocShaders(webGL);
		// webGL.getExtension('WEBGL_lose_context').loseContext();
		// window.cancelAnimationFrame(animationID);
	});

	let touchVector;

	/**
	 * matrix is attitude matrix, not projection matrix
	 */
	const vectorFromScreenLocation = (point, canvasSize) => {
		const matrix = ear.math
			.multiplyMatrices4(ear.math
				.multiplyMatrices4(projectionMatrix, viewMatrix), modelMatrix);
		const inverse = ear.math.invertMatrix4(matrix);
		const scaled = [0, 1].map(i => point[i] / canvasSize[i])
		const screen = [
			dragSpeed * 2.0 * (0.5 - scaled[0]),
			dragSpeed * 2.0 * (scaled[1] - 0.5),
			// 0.05, // this controls the speed of the spin
			1.0, // this controls the speed of the spin
			0.0,
		];
		const vec = ear.math.multiplyMatrix4Vector3(inverse, screen);
		return ear.math.normalize3(vec);
	};

	const onPress = (e) => {
		const screenLocation = [e.offsetX, e.offsetY];
		touchVector = vectorFromScreenLocation(
			screenLocation,
			[canvas.clientWidth, canvas.clientHeight],
		);
	};

	const onMove = (e) => {
		if (!touchVector) { return; }
		const screenLocation = [e.offsetX, e.offsetY];
		const nowVector = vectorFromScreenLocation(
			screenLocation,
			[canvas.clientWidth, canvas.clientHeight],
		);
		const quaternion = ear.math.quaternionFromTwoVectors(touchVector, nowVector);
		const matrix = ear.math.matrix4FromQuaternion(quaternion);
		modelMatrix = ear.math.multiplyMatrices4(modelMatrix, matrix);
		draw(webGL, [canvas.clientWidth, canvas.clientHeight]);
	};

	const onScroll = (e) => {
		const scrollSensitivity = 1 / 100;
		const radius = -viewMatrix[14];
		const delta = e.deltaY * scrollSensitivity;
		if (Math.abs(delta) < 1e-3) { return false; }
		viewMatrix = [...ear.math.identity4x4];
		viewMatrix[14] = -radius * (1 + delta);
		draw(webGL);
		return false;
	};

	const onRelease = () => { touchVector = undefined; };

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
