<script>
	export let files = [];
</script>

	{#if files.length}
		<!-- <hr /> -->
		<span on:click={() => { files = []; }}>
			<svg xmlns="http://www.w3.org/2000/svg" width="1rem" height="1rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
		</span>
	{/if}

<style>
	span {
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		line-height: 1rem;
		background-color: #555;
		margin: 0 -0.5rem;
		margin-top: -0.5rem;
		padding: 0.25rem 0.5rem;
	}
	span:hover { color: #fb4; }
	span svg {
		margin-right: 0.15rem;
		stroke: #eee;
	}
	span:hover svg { stroke: #fb4; }
/*	hr {
		margin: 0.25rem 0;
		padding: 0;
		border: 0;
		height: 2px;
		background: #ccc;
		background-image: linear-gradient(to right, #333, #ccc, #333);
	}*/
	hr {
		margin: 0.25rem 0;
		padding: 0;
		border: 0;
		height: 1.5px;
		background-color: #ccc;
	}
</style>