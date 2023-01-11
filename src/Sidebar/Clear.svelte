<script>
	export let files = [];
	export let selectedIndex;

	const onClick = () => {
		files = [];
		selectedIndex = 0;
	};
</script>

	<div>
		<p>FILES</p>
		{#if files.length}
			<button on:click={onClick}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polyline points="3 6 5 6 21 6"></polyline>
					<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
					<line x1="10" y1="11" x2="10" y2="17"></line>
					<line x1="14" y1="11" x2="14" y2="17"></line>
				</svg>
			</button>
		{/if}
	</div>

<style>
	p {
		font-size: 0.8rem;
		color: #bbb;
		font-weight: bold;
	}
	div {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #555;
		padding: 0.35rem 0.5rem;
		height: 1.7rem; /* padding top/bottom * 2 */
	}
	svg {
		cursor: pointer;
		margin-right: 0.15rem;
		stroke: #eee;
		width: 1rem;
		height: 1rem;
	}
	svg:hover { stroke: #fb4; }
</style>