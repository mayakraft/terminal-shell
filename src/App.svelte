<script>
	import ear from "rabbit-ear";

	import Shell from "./Shell.svelte";
	import DragAndDrop from "./FileManager/DragAndDrop.svelte";
	import FileManager from "./FileManager/FileManager.svelte";

	import AlertCopied from "./AlertCopied.svelte";
	import Header from "./Header.svelte";
	import Sidebar from "./Sidebar/Sidebar.svelte";
	import Terminal from "./Terminal/Terminal.svelte";
	import FileViewer from "./FileViewer.svelte";

	let history;
	let exec;
	let loadFiles;
	let files;

	let showingFile = false;
	let selectedFile;

	let userInput = "";

	let alertCopiedKey = -1;

	// $: console.log("history", history);

</script>

	<Shell bind:exec={exec} bind:history={history} {files} />
	<DragAndDrop {loadFiles} />
	<FileManager bind:files={files} bind:loadFiles={loadFiles} />

	<Header bind:history={history} {showingFile} />
	<div class="container">
		<Sidebar
			bind:files={files}
			bind:showingFile={showingFile}
			bind:selectedFile={selectedFile}
		/>
		{#if showingFile}
			<FileViewer file={selectedFile} />
		{:else}
			<Terminal
				bind:alertCopiedKey={alertCopiedKey}
				bind:userInput={userInput}
				bind:history={history}
				{exec}
			/>
		{/if}
	</div>
	<AlertCopied key={alertCopiedKey} />

<style>
	.container {
		width: 100vw;
		height: calc(100vh - 2.5rem);
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
	}
	.container > :global(*:nth-child(1)) {
		flex: 1 0 0;
		max-width: 33vw;
	}
	.container > :global(*:last-child) {
		flex: 0 1 100vw;
		max-width: 80vw;
	}
</style>
