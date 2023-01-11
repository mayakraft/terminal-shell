<script>
	import HoverDescription from "./HoverDescription.svelte";
	import Clear from "./Clear.svelte";
	import Item from "./Item.svelte";
	export let files = [];

	let selectedIndex = 0;
	let highlightedFile;
	let cursor = [0, 0];

	export let showingFile;
	export let selectedFile;

	$: showingFile = selectedIndex !== 0;
	$: selectedFile = selectedIndex === 0
		? undefined
		: files[selectedIndex - 1];

	const onMouseMove = (e, file) => {
		highlightedFile = file;
		cursor = [e.x - 10, e.y + 15];
	};
	const onMouseOut = () => highlightedFile = undefined;
</script>

<div class="container">
	<div class="outline">
		<Item
			name="terminal"
			mimeType={"terminal"}
			onClick={() => { selectedIndex = 0; }}
			onMove={() => {}}
			onOut={() => {}}
			index={0}
			{selectedIndex}
		/>
		<Clear
			bind:files={files}
			bind:selectedIndex={selectedIndex}
		/>
		{#if !files.length}
			<div class="drag-and-drop">
				<p>drag and drop</p>
			</div>
		{/if}
		{#each files as file, i}
			<Item
				name={file.name}
				mimeType={file.type}
				onClick={() => { selectedIndex = i + 1; }}
				onMove={(e) => onMouseMove(e, file)}
				onOut={onMouseOut}
				index={i + 1}
				{selectedIndex}
			/>
		{/each}
	</div>
</div>

{#if highlightedFile !== undefined}
	<HoverDescription file={highlightedFile} {cursor} />
{/if}

<style>
	.drag-and-drop {
		display: flex;
		flex-direction: row;
		justify-content: center;
		padding: 0.5rem 0;
	}
	p {
		color: #888;
		font-style: italic;
		white-space: nowrap;
		word-break: keep-all;
	}
	.container {
		height: 100%;
	}
	.outline {
/*		padding: 0 0.5rem;*/
		height: 100%;
		background-color: #393939;
		overflow: auto;
	}
</style>
