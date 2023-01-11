<script>
	import Icon from "./Icon.svelte";
	export let name;
	// mimeType can be undefined and no icon will appear
	export let mimeType;

	export let index;
	export let selectedIndex;

	export let onMove;
	export let onOut;
	export let onClick;

</script>

<button class={index == selectedIndex ? "highlighted" : ""}
	on:click={onClick}
	on:mousemove={onMove}
	on:mouseout={onOut}
	on:blur={() => {}}
	>
	<!-- <span class="spacer"></span> -->
	<Icon {mimeType} /><p>{name}</p>
</button>

<style>
	button {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		cursor: pointer;
	}
	button:focus {
		outline-color: #fb4;
	}
	.highlighted {
		color: #333;
		background-color: #fb4;
		font-weight: bold;
	}
	p {
		flex: 1 1;
		margin: 0.5rem;
		font-size: 1rem;
	}
	button :global(svg) {
		margin-left: 0.5rem;
		stroke: #eee;
	}
	button:hover p { color: #fb4; }
	button:hover :global(svg) { stroke: #fb4; }
	.highlighted:hover { background-color: #fc7; }
	.highlighted:hover p { color: #333; }
	.highlighted:hover :global(svg) { stroke: #333; }
	.highlighted :global(svg) { stroke: #333; }
/*	.highlighted:hover :global(svg) { stroke: #fff; }*/
</style>
