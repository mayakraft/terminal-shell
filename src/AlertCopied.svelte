<script>
	export let key = Math.random();
	let show = false;
	let alertRef;

	$: {
		if (key !== -1) {
			show = false;
			setTimeout(() => { show = true; }, 100);
		}
	};

</script>

{#if show}
	<div bind:this={alertRef} class="alert fade" id="copied-alert">
		<pre>Copied</pre>
	</div>
{/if}

<style>
/*the alert at the bottom corner of the page, indicating text has been copied*/
.alert {
	background-color: #222;
	position: fixed;
	top: 4rem;
	right: 2rem;
	z-index: 10;
	border-radius: 5px;
	border: 2px solid #fb4;
	box-shadow: 0.5rem 0.5rem #333;
	pointer-events: none;
}
.fade {
	animation-name: fadeout;
	animation-duration: 1.5s;
	animation-fill-mode: forwards;
}
@keyframes fadeout {
	0% { opacity: 1; }
	66% { opacity: 1; }
	100% { opacity: 0; }
}
pre {
	margin: 0.5rem 0.5rem;
	color: #fb4;
	font-weight: bold;
	font-size: 1.5rem;
}
</style>