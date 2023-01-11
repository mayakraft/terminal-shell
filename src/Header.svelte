<script>
	export let history = [];
	export let showingFile = false;
</script>

<div class="header-row">
	<div class="flex-row">
		<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-0.04 -0.04 1.08 1.08" stroke-width="0.1" stroke-linecap="round">
			<g class="creasePattern" stroke="black" fill="white">
				<polygon points="0,0 1,0 1,1 0,1" class="boundary"/>
				<path d="M0 1L1 0" class="valley" stroke="#26F" stroke-dasharray="0.1 0.15" stroke-dashoffset="0.095"/>
				<path d="M0 0L1 0M1 0L1 1M1 1L0 1M0 1L0 0" class="boundary"/>
			</g>
			<g class="arrow" stroke-width="0.09" stroke="black">
				<path class="arrow-tail" stroke="none" d="M0.09999999999999998,0.19999999999999998L0.3695671856926754,0.3995833970993846L0.4214070290951129,0.10409628970549045Z" visibility="visible"/>
				<path class="arrow-line" style="fill:none;" d="M0.4,0.25C0.72445,0.29635000000000006,0.89635,0.52555,0.85,0.85"/>
			</g>
		</svg>
		<h3>Rabbit Ear</h3>
	</div>
	{#if !showingFile}
		<button on:click={() => { history = []; }}>
			clear terminal
		</button>
	{/if}
</div>

<style>
	svg {
		width: 1.75rem;
		height: 1.75rem;
	}
	h3 {
		font-size: 1.9rem;
		font-weight: bold;
		margin: 0;
		padding: 0;
		letter-spacing: -0.09rem;
	}
	.header-row {
		height: 2.5rem;
		background-color: #17c;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		padding: 0 0.5rem;
	}
	.header-row *::selection,
	.header-row *::-moz-selection {
		color: #17c;
		background-color: #fb4;
	}
	.flex-row {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.flex-row > *:first-child {
		margin-right: 0.5rem;
	}
	button { cursor: pointer; }
	button:hover { color: #fb4; }
</style>
