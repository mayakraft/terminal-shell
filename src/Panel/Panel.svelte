<script>
	import FileDialog from "./FileDialog.svelte";
	export let fileDidLoad = () => {};
	export let exec;
</script>

<div class="panel">
	<FileDialog {fileDidLoad} {exec} />
</div>

<style>
	.panel {
		grid-column: 1/2;
		grid-row: 1/2;

		margin: 0.25rem;
		padding: 0.5rem;

		background-color: #111;
		border: 0.2rem solid #999;
		border-radius: 0.5rem;
		background-color: #222;
	}
</style>
