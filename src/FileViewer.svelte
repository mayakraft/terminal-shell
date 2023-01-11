<script>
	import FoldView from "./FoldView/FoldView.svelte";
	import opxToSVG from "./opxToSVG";

	export let file;

	const openFile = () => {
		const blob = new Blob([file.contents], { type: file.type });
		const url = window.URL.createObjectURL(blob, { oneTimeOnly: true });
		const anchor = document.createElement('a');
		anchor.href = url;
		anchor.target = '_blank';
		anchor.click();
	};

	const jsonString = (json) => {
		try {
			return JSON.stringify(json);
		} catch (error) {
			return "";
		}
	};
</script>

{#if file}
	<div>
		{#if file.type.split("/")[0] === "image"}
		<!-- {console.log("file.url", file.url)} -->
			<img alt={file.name} src={file.url} >
		{:else if file.type.split("/")[0] === "audio"}
			<button on:click={openFile}>open audio file</button>
		{:else if file.type.split("/")[0] === "video"}
			<button on:click={openFile}>open video file</button>
		{:else if file.type.split("/")[0] === "font"}
			<button on:click={openFile}>open font file</button>
		{:else if file.type.split("/")[0] === "text"}
			<textarea readonly>{file.contents}</textarea>
		{:else if file.type.split("/")[0] === "application"}
			{#if file.type === "application/json"}
				{#if file.extension === "fold" || file.extension === "cp"}
					<FoldView FOLD={file.contents} />
				{:else}
					<textarea readonly>{jsonString(file.contents)}</textarea>
				{/if}
			{:else if file.type === "application/pdf"}
				<button on:click={openFile}>open pdf file</button>
			{:else}
				<button on:click={openFile}>open unknown file type</button>
			{/if}
		{:else}
			<!-- unknown mime type. consult file extension -->
			{#if file.extension === "opx"}
				<img alt={file.name} src={`data:image/svg+xml;utf8,${opxToSVG(file.contents)}`}>
				<!-- <p>ORIPA file</p> -->
			{:else}
				<button on:click={openFile}>open unknown file type</button>
			{/if}
		{/if}
	</div>
{/if}

<style>
	div {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem;
	}
	img {
		object-fit: contain;
		width: 100%;
		height: 100%;
	}
	textarea {
		resize: none;
		background-color: #222;
		color: #bbb;
		width: 100%;
		height: 100%;
		outline: none !important;
		border: 0;
		outline-color: transparent;
	}
	textarea:focus {
		outline: none !important;
		border: 0;
		outline-color: transparent;
	}
	button {
		color: #fb4;
		cursor: pointer;
	}
	button:hover {
		color: #fff;
	}
</style>