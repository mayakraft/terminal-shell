<script>
	export let viewMode = "svg";
	export let strokeWidth = 0.0025;
</script>

<div class="view panel">
	<input
		type="radio"
		name="radio-view"
		value="radio-view-svg"
		on:click={() => viewMode = "svg"}
		checked={viewMode==="svg"}>
	<label for="radio-view-svg">svg</label>
	<input
		type="radio"
		name="radio-view"
		value="radio-view-webgl"
		on:click={() => viewMode = "webgl"}
		checked={viewMode==="webgl"}>
	<label for="radio-view-webgl">webgl</label>
	<hr />
	<span>stroke width</span><input type="range" min="0.0001" max="0.04" step="0.0002" bind:value={strokeWidth} />
</div>

<style>
	.view {
		grid-column: 1/2;
		grid-row: 2/3;
	}
	.panel {
		margin: 0.25rem;
		padding: 0.5rem;
		background-color: #111;
		border: 0.2rem solid #666;
		border-radius: 0.5rem;
		background-color: #222;
	}
</style>
