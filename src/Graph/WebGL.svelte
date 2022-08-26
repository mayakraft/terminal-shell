<script>
	import ear from "rabbit-ear";
	import { onMount, onDestroy } from "svelte";
	import {
		initializeWebGL,
		makePerspectiveCamera,
		makeOrthographicCamera,
	} from "./WebGL/Helpers";
	import WebGLCreasePattern from "./FoldToWebGL/WebGLCreasePattern";
	import WebGLFoldedForm from "./FoldToWebGL/WebGLFoldedForm";
	// import vertexThickEdges3 from "./WebGL/thickEdges3.vert?raw";
	// import fragmentSimple3 from "./WebGL/simple3.frag?raw";

	export let origami = {};
	export let strokeWidth = 0.0025;
	let { innerWidth, innerHeight } = window;

	// webgl, hold onto these so we can dealloc them later
	let webGL, webGLVersion;
	let animationID;
	const shaders = [];

	const drawShader = (gl, shader) => {
		gl.useProgram(shader.program);
		shader.vertexArrays.forEach(el => {
			gl.bindBuffer(gl.ARRAY_BUFFER, el.buffer);
			gl.bufferData(gl.ARRAY_BUFFER, el.data, gl.STATIC_DRAW);
			gl.vertexAttribPointer(el.location, el.length, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(el.location);
		});
		// gl.linkProgram(shader.program);
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

	const draw = (gl, size) => {
		// recalculate any uniforms
		const matrix = makeOrthographicCamera(...size);
		// const matrix = makePerspectiveCamera(...size, frameNum);
		// update uniforms
		// all shaders get these uniform
		shaders.forEach(shader => {
			gl.useProgram(shader.program);
			gl.uniformMatrix4fv(gl.getUniformLocation(shader.program, "matrix"), false, matrix);
		});
		// uniforms unique to individual shaders
		gl.useProgram(shaders[1].program);
		gl.uniform1f(gl.getUniformLocation(shaders[1].program, "thickness"), strokeWidth / 2);
		// bind buffers and draw elements
		shaders.forEach(shader => drawShader(gl, shader));
		frameNum += 1;
	};

	const redrawCanvas = (w, h) => {
		const element = document.querySelector("canvas");
		if (!element || !webGL) { return; }
		draw(webGL, [element.clientWidth, element.clientHeight]);
	};

	const deallocShaders = (gl) => {
		shaders.forEach(shader => {
			shader.vertexArrays.forEach(vert => gl.deleteBuffer(vert.buffer));
			shader.elementArrays.forEach(vert => gl.deleteBuffer(vert.buffer));
			webGL.deleteProgram(shader.program);
		});
		while (shaders.length) { shaders.pop(); }
		// gl.deleteTexture(someTexture);
		// gl.deleteRenderbuffer(someRenderbuffer);
		// gl.deleteFramebuffer(someFramebuffer);
	};

	const rebuildShaders = (graph) => {
		if (!webGL) { return; }
		deallocShaders(webGL);
		shaders.push(...WebGLCreasePattern(graph, webGL, webGLVersion));
	};

	$: redrawCanvas(innerWidth, innerHeight);

	$: rebuildShaders(origami);

	onMount(() => {
		const element = document.querySelector("canvas");
		const { gl, version } = initializeWebGL(element);
		webGL = gl;
		webGLVersion = version;
		if (!gl) { return; }
		rebuildShaders(origami);
		redrawCanvas(origami);

		const animate = () => {
			animationID = window.requestAnimationFrame(animate);
			draw(gl, [element.clientWidth, element.clientHeight]);
		};
		animate();
	});

	onDestroy(() => {
		// dealloc webgl
		deallocShaders(webGL);
		// webGL.getExtension('WEBGL_lose_context').loseContext();
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
