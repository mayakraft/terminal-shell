<script>
	import ear from "rabbit-ear";
	import { onMount } from "svelte";

	export let origami = {};
	export let viewClass = "creasePattern";
	export let strokeWidth = 0.0025;

	let origamiLayer = ear.svg.g().setClass("origami");

	const render = (FOLD) => origamiLayer
		.removeChildren()
		.origami(FOLD, {
			viewBox: true,
			// strokeWidth: true,
			vertices: true,
			padding: 0.025
		}).strokeWidth(strokeWidth);

	onMount(() => {
		origamiLayer.appendTo(document.querySelector(".graph svg"));
		render(origami);
	});

	$: render(origami, strokeWidth);

</script>

<div class="graph">
	<svg></svg>
</div>

<style>
	svg {
		transform: scale(1, -1);
	}
	.graph {
		grid-column: 2/3;
		grid-row: 1/4;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	svg {
		width: 100%;
		max-height: 100vh;
	}
	/* default rendering is .creasePattern even if no class exists */
	svg :global(.boundaries) { stroke: #555; fill: #1d1d1d; }
	svg :global(.edges .unassigned) { stroke: #b5e; }
	svg :global(.edges .boundary) { stroke: #555; }
	svg :global(.edges .valley) { stroke: #269; }
	svg :global(.edges .mountain) { stroke: #c31; }
	svg :global(.edges .flat) { stroke: #333; }
	/* overwrite default style if .foldedForm exists */
	svg :global(.foldedForm .boundaries) {}
	svg :global(.foldedForm .edges .boundary) {}
	svg :global(.foldedForm .edges .valley) {}
	svg :global(.foldedForm .edges .mountain) {}
</style>
