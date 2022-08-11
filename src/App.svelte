<script>
	import { onMount } from "svelte";
	import Panel from "./Panel/Panel.svelte";
	import Shell from "./Kernel/Shell.svelte";
	import Terminal from "./Kernel/Terminal.svelte";
	import SVG from "./Graph/SVG.svelte";
	import example from "./example.json";
	// Shell exec() method
	let exec;
	// shell exec() history
	let history = [];
	// the origami
	let origami = {};

	onMount(() => { origami = example; });

	const fileDidLoad = (result) => {
		// first, reset any app data:
		//
		// we can either do this (much simpler):
		// exec(`origami = ${JSON.stringify(JSON.parse(newFile))}`)
		// or kind of hijack the terminal output so it's not showing the entire JSON
		if (result.success) {
			history = history.concat([
				{ type: "input", value: `origami = [FileDialog file]` },
				{ type: "output", value: result.success },
			]);
			origami = result.success;
		} else {
			history = history.concat([
				{ type: "input", value: `origami = [FileDialog file]` },
				{ type: "error", value: result.error },
			]);
		}
	};
</script>

<main>
	<Shell bind:exec={exec} bind:origami={origami} bind:history={history}/>
	<Panel {fileDidLoad} {exec} />
	<Terminal {exec} {history} />
	<SVG {origami} />
</main>

<style>
	main {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-columns: 50% 50%;
		grid-template-rows: 50% 50%;
	}
</style>
