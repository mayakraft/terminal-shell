<script>
	export let renderEngine = "svg";
	export let webGLPerspective = "orthographic";
	export let viewClass = "creasePattern";
	export let strokeWidth = 0.0025;
</script>

<div class="view panel">
	<input
		type="radio"
		name="radio-renderer"
		value="radio-renderer-svg"
		on:click={() => renderEngine = "svg"}
		checked={renderEngine==="svg"}>
	<label for="radio-renderer-svg">svg</label>
	<input
		type="radio"
		name="radio-renderer"
		value="radio-renderer-webgl"
		on:click={() => renderEngine = "webgl"}
		checked={renderEngine==="webgl"}>
	<label for="radio-renderer-webgl">webgl</label>
	<br/>
	{#if renderEngine === "webgl"}
		<input
			type="radio"
			name="radio-webgl-perspective"
			value="radio-webgl-perspective-orthographic"
			on:click={() => webGLPerspective = "orthographic"}
			checked={webGLPerspective==="orthographic"}>
		<label for="radio-webgl-perspective-orthographic">orthographic</label>
		<input
			type="radio"
			name="radio-webgl-perspective"
			value="radio-webgl-perspective-perspective"
			on:click={() => webGLPerspective = "perspective"}
			checked={webGLPerspective==="perspective"}>
		<label for="radio-webgl-perspective-perspective">perspective</label>
		<br/>
	{/if}
	<input
		type="radio"
		name="radio-view-class"
		value="radio-view-class-crease-pattern"
		on:click={() => viewClass = "creasePattern"}
		checked={viewClass==="creasePattern"}>
	<label for="radio-view-class-crease-pattern">crease pattern</label>
	<input
		type="radio"
		name="radio-view-class"
		value="radio-view-class-folded-form"
		on:click={() => viewClass = "foldedForm"}
		checked={viewClass==="foldedForm"}>
	<label for="radio-view-class-folded-form">folded form</label>
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
