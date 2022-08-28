<script>
	import { onMount } from "svelte";
	import Modifiers from "./Panels/Modifiers.svelte";
	import View from "./Panels/View.svelte";
	import Terminal from "./Panels/Terminal.svelte";
	import Shell from "./Kernel/Shell.svelte";
	import SVG from "./Graph/SVG.svelte";
	import WebGL from "./Graph/WebGL.svelte";
	// import example from "./example.fold?raw";
	import example from "./example3D.fold?raw";
	// import example from "./3dmodel.fold?raw";
	// import example from "./MoosersTrain.fold?raw";
	// Shell exec() method
	let exec;
	// shell exec() history
	let history = [];
	// the origami
	let origami = {};
	// view options
	let renderEngine = "svg";
	let webGLPerspective = "orthographic";
	let viewClass = "foldedForm"; //"creasePattern";
	let strokeWidth = 0.0025;

	// load example on start
	// onMount(() => { origami = JSON.parse(example); });
	onMount(() => fileDidLoad({value:JSON.parse(example)}));

	const fileDidLoad = (result) => {
		// first, reset any app data. especially if tied to the origami
		// second: update origami. this can happen two ways, A:
		const newHistory = [{ type: "input", value: `origami = [FileDialog file]` }];
		if (result.value) {
			origami = result.value;
			// update view mode according to file type
			if (origami.frame_classes) {
				if (origami.frame_classes.includes("creasePattern")) {
					webGLPerspective = "orthographic";
					viewClass = "creasePattern";
				} else if (origami.frame_classes.includes("foldedForm")) {
					renderEngine = "webgl";
					webGLPerspective = "perspective";
					viewClass = "foldedForm";
				}
			}
		}
		newHistory.push(result.error
			? { type: "error", value: result.error }
			: { type: "output", value: result.value });
		// or B:
		// exec(`origami = ${JSON.stringify(JSON.parse(newFile))}`)
	};
</script>

<main>
	<Shell bind:exec={exec} bind:origami={origami} bind:history={history}/>
	<Modifiers {fileDidLoad} {exec} />
	<View
		bind:renderEngine={renderEngine}
		bind:webGLPerspective={webGLPerspective}
		bind:viewClass={viewClass}
		bind:strokeWidth={strokeWidth}
		/>
	<Terminal {exec} {history} />
	{#if renderEngine === "svg"}
		<SVG {origami} {viewClass} {strokeWidth} />
	{:else}
		<WebGL {origami} {viewClass} {webGLPerspective} {strokeWidth} />
	{/if}
</main>

<style>
	main {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: 50% 50%;
		grid-template-rows: 33% 33% 34%;
	}
</style>
