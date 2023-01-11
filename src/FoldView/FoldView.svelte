<script>
	import ear from "rabbit-ear";
	import WebGLView from "./WebGLView.svelte";
	import Settings from "./Settings.svelte";
	import averageEdgeLength from "./averageEdgeLength.js";

	let showSettings = false;

	export let FOLD;
	let origami = {};
	let frames = [];
	let selectedFrame = 0;

	// view settings
	let perspective = "orthographic";
	let viewClass = "creasePattern";
	let fov = 30;
	let strokeWidth = 0.0025;
	let layerNudge = 1e-5;
	let opacity = 1.0;
	let flipCameraZ = false;
	let frontColor = "#57f";
	let backColor = "#fff";
	let showFoldedCreases = false;
	let showFoldedFaces = true;
	let showFoldedFaceOutlines = true;

	// set the view settings (crease pattern / folded, etc...)
	// depending on if the FOLD object contains frame_classes.
	const updateViewSettings = () => {
		if (origami.frame_classes) {
			if (origami.frame_classes.includes("creasePattern")) {
				perspective = "orthographic";
				viewClass = "creasePattern";
			} else if (origami.frame_classes.includes("foldedForm")) {
				perspective = "perspective";
				viewClass = "foldedForm";
			}
		}
		if (origami) {
			// find a decent stroke width
			// (do this even if we cannot infer creasePattern from frame_classes)
			const avgEdgeLen = averageEdgeLength(origami);
			// instead of setting the strokeWidth, set the
			// strokeWidthSlider, which in turn sets the strokeWidth
			// invert this: Math.pow(2, strokeWidthSlider) / 100000;
			strokeWidthSlider = !avgEdgeLen
				? 0.1
				: Math.log2((avgEdgeLen * 0.02) * 100000);
		}
		if (origami) {
			// find a decent spacing between layers (layerNudge)
			const bounds = ear.graph.getBoundingBox(origami);
			if (bounds && bounds.span) {
				const maxSpan = Math.max(...bounds.span);
				// instead of setting the layerNudge, set the
				// layerNudgeSlider, which in turn sets the layerNudge
				layerNudgeSlider = Math.log2((maxSpan * 0.0005) * 100000);
			}
		}
	};

	const getFileFrames = (foldFile) => !foldFile.file_frames
		? [ear.graph.flattenFrame(foldFile, 0)]
		: Array.from(Array(foldFile.file_frames.length + 1))
			.map((_, i) => ear.graph.flattenFrame(foldFile, i));

	$: {
		frames = FOLD
			? getFileFrames(JSON.parse(JSON.stringify(FOLD)))
			: [];
	};

	$: {
		if (selectedFrame > frames.length) {
			selectedFrame = frames.length - 1;
		}
		origami = selectedFrame === -1
			? {}
			: frames[selectedFrame];
	};

	$: updateViewSettings(origami);
	
	// settings panel
	let strokeWidthSlider = 5;
	$: strokeWidth = Math.pow(2, strokeWidthSlider) / 100000;

	let layerNudgeSlider = 6;
	$: layerNudge = Math.pow(2, layerNudgeSlider) / 1000000;

	const arrowPressed = () => showSettings = !showSettings;

</script>

<div class="container">
	<WebGLView
		{origami}
		{viewClass}
		{perspective}
		{strokeWidth}
		{layerNudge}
		{opacity}
		{fov}
		{flipCameraZ}
		{frontColor}
		{backColor}
		{showFoldedCreases}
		{showFoldedFaces}
		{showFoldedFaceOutlines}
	/>

	<div class="settings">
		{#if showSettings}
			<button on:click={arrowPressed}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="10"></circle>
					<polyline points="12 8 8 12 12 16"></polyline>
					<line x1="16" y1="12" x2="8" y2="12"></line>
				</svg>
			</button>
			<Settings
				{origami}
				{frames}
				bind:selectedFrame={selectedFrame}
				bind:perspective={perspective}
				bind:viewClass={viewClass}
				bind:layerNudge={layerNudge}
				bind:opacity={opacity}
				bind:fov={fov}
				bind:flipCameraZ={flipCameraZ}
				bind:frontColor={frontColor}
				bind:backColor={backColor}
				bind:showFoldedCreases={showFoldedCreases}
				bind:showFoldedFaces={showFoldedFaces}
				bind:showFoldedFaceOutlines={showFoldedFaceOutlines}
				bind:strokeWidthSlider={strokeWidthSlider}
				bind:layerNudgeSlider={layerNudgeSlider}
			/>

		{:else}
			<button on:click={arrowPressed}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<circle cx="12" cy="12" r="10"></circle>
					<polyline points="12 16 16 12 12 8"></polyline>
					<line x1="8" y1="12" x2="16" y2="12"></line>
				</svg>
			</button>
		{/if}
	</div>
</div>

<style>
	.container {
		position: relative;
		width: 100%;
		height: 100%;
	}
	.settings {
		position: absolute;
		z-index: 4;
		top: 0;
		left: 0;
		background-color: rgba(36, 36, 36, 0.7);
		padding: 0.5rem;
	}
	button {
		border: none;
		margin: 0;
		padding: 0;
		width: auto;
		overflow: visible;
		background: transparent;
		color: inherit;
		font: inherit;
		line-height: normal;
	}
	button:hover svg {
		stroke: #fb4;
	}
	svg {
		stroke: #555;
		width: 2rem;
		height: 2rem;
	}
</style>
