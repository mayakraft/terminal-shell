<script>
	import { onMount } from "svelte";
	import Modifiers from "./Panels/Modifiers.svelte";
	import View from "./Panels/View.svelte";
	import Terminal from "./Panels/Terminal.svelte";
	import Shell from "./Kernel/Shell.svelte";
	import SVG from "./Graph/SVG.svelte";
	import WebGL from "./Graph/WebGL.svelte";
	import example from "./example.json";
	// Shell exec() method
	let exec;
	// shell exec() history
	let history = [];
	// the origami
	let origami = {};
	let viewMode = "svg";
	let strokeWidth = 0.0025;

	onMount(() => { origami = example; });

	const fileDidLoad = (result) => {
		// first, reset any app data:
		const newHistory = [{ type: "input", value: `origami = [FileDialog file]` }];
		if (result.value) { origami = result.value; }
		newHistory.push(result.error
			? { type: "error", value: result.error }
			: { type: "output", value: result.value });
		// exec(`origami = ${JSON.stringify(JSON.parse(newFile))}`)
	};
</script>

<main>
	<Shell bind:exec={exec} bind:origami={origami} bind:history={history}/>
	<Modifiers {fileDidLoad} {exec} />
	<View bind:viewMode={viewMode} bind:strokeWidth={strokeWidth} />
	<Terminal {exec} {history} />
	{#if viewMode === "svg"}
		<SVG {origami} {strokeWidth} />
	{:else}
		<WebGL {origami} {strokeWidth} />
	{/if}
</main>

<style>
	main {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: 50% 50%;
		grid-template-rows: 40% 20% 40%;
	}
</style>
