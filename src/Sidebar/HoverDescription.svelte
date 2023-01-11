<script>
	export let cursor = [0, 0];
	export let file;
</script>

<div class="hoverbox" style="left: {cursor[0]}px; top: {cursor[1]}px;">
	<p><span>{file.filename}</span></p>
	<hr />
	<p>size: <span>{file.size} bytes</span></p>
	<p>type: <span>{file.type}</span></p>
</div>

<style>
	.hoverbox {
		pointer-events: none;
		position: absolute;
		background-color: #181818;
		padding: 0.5rem;
		z-index: 2;
	}
	p {
		margin: 0;
		color: #aaa;
	}
	span {
		color: white;
		font-weight: bold;
	}
	hr {
		margin: 0.25rem 0;
		padding: 0;
		background-color: #aaa;
	}
</style>
