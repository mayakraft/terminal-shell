<script>
	export let key;
	export let match;
</script>

<p>
	<span class={match.type}>{key}</span>{#if match.type === "Function"}
		{#if match.jsdocs && match.jsdocs.params}
			({#each match.jsdocs.params as param, i}
				{#if i !== 0}, {/if}<span class="param">{(param.type || { names: []}).names.join(" | ")}</span>{/each}){/if}{#if match.jsdocs && match.jsdocs.returns}
			{#if match.jsdocs.returns}
				: {#each match.jsdocs.returns as ret, i}
					{#if i !== 0}, {/if}<span class="return">{(ret.type || { names: []}).names.join(" | ")}</span>{/each}
			{/if}
		{/if}
	{/if}
</p>

<style>
	.Function { color: #66D9EF; }
	.Object { color: #E6DB74; }
	.Array { color: #E6DB74; }
	.String { color: #E6DB74; }
	.Number { color: #AE81FF; }
	.Boolean { color: #AE81FF; }
/*	.constant { color: #AE81FF; }*/
	.param { color: #FD9720; }
	.return { color: #A6E22E; }
	.undefined { color: #66D9EF; }
	.comment { color: #708090; }
	.def { color: #A6E22E; }
	.op { color: #F92672; }
</style>