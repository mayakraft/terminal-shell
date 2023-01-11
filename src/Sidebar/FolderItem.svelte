<div class="item">
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<polyline points="6 9 12 15 18 9"></polyline>
	</svg>
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
	</svg>
	<p>./</p>
</div>

<style>
	.item {
		display: flex;
		flex-direction: row;
		justify-content: start;
		align-items: center;
		margin: 0.5rem 0;
	}
	.item { margin-top: 0; }
	p { flex: 1 1; }
	.item:first-child { margin-top: 0; }
	.item p { margin: 0 0 0 0.5rem; }
	.item :global(svg) { stroke: #eee; }
</style>