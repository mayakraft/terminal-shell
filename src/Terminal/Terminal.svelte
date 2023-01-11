<script>
	import { onMount, afterUpdate } from "svelte";
	import Entry from "./Entry.svelte";
	import autocompleteMatch from "../autocomplete/match";
	import SyntaxHighlighted from "./SyntaxHighlighted.svelte";

	export let exec = () => {};
	export let history = [];
	// the value bound to the textarea input.
	export let userInput = "";
	export let alertCopiedKey = -1;

	let textareaRef, preRef;
	let upArrowIndex = undefined;

	let nextMatches = {};

	const onKeyDown = (e) => {
		// console.log(e);
		switch (e.keyCode) {
			case 13: // return
				if (e.shiftKey) {
					// shift + enter allows default behavior. newline in terminal
					// todo
					// hack. + 2
					// return count is calculated before string is modified.
					const returnMatch = e.target.value.match(/\n/g);
					const returnLength = 2 + (returnMatch === null
						? 0
						: returnMatch.length);
					textareaRef.style.height = `calc(1.25rem * ${returnLength})`;
					break;
				}
				exec(textareaRef.value);
				userInput = "";
				e.preventDefault();
				break;
			case 38: { // up arrow
				e.preventDefault();
				const inputs = history.filter(el => el.type === "input");
				if (inputs.length === 0) { return; }
				upArrowIndex = upArrowIndex === undefined
					? inputs.length - 1
					: upArrowIndex - 1;
				if (upArrowIndex < 0) {
					upArrowIndex = undefined;
					userInput = "";
				} else {
					userInput = inputs[upArrowIndex % inputs.length].value;
				}
			}
				break;
			case 40: { // down arrow
				e.preventDefault();
				const inputs = history.filter(el => el.type === "input");
				if (inputs.length === 0) { return; }
				upArrowIndex = upArrowIndex === undefined
					? 0
					: upArrowIndex + 1;
				if (upArrowIndex >= inputs.length) {
					upArrowIndex = undefined;
					userInput = "";
				} else {
					userInput = inputs[upArrowIndex % inputs.length].value;
				}
			}
				break;
			case 75: // "k"
				if (e.metaKey && !e.altKey) {
					history = [];
					e.preventDefault();
				}
				break;
			default: break;
		}
	};

	onMount(() => { textareaRef.focus(); });
	afterUpdate(() => { preRef.scrollTop = preRef.scrollHeight; });

	$: {
		history;
		upArrowIndex = undefined;
	}

	$: nextMatches = autocompleteMatch(userInput);

</script>

<svelte:window on:keydown={onKeyDown} />

<div class="container">
	<div class="terminal">
		<!-- filling will expand to take over only the empty space -->
		<!-- pushing the textarea box to the bottom -->
		<div class="filling" />
		<pre bind:this={preRef}>{#each history as data}<Entry
			{data}
			bind:alertCopiedKey={alertCopiedKey}
		/>{"\n"}{/each}</pre>

		<textarea
			bind:this={textareaRef}
			bind:value={userInput}
			autocomplete="off"
			autocorrect="off"
			rows="1"
		/>
	</div>
	{#if Object.keys(nextMatches).length}
		<div class="floating">
			{#each Object.entries(nextMatches) as [key, match]}
				<SyntaxHighlighted {key} {match} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		padding: 0.5rem;
		height: 100%;
		position: relative;
	}
	.terminal {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	.filling { flex: 1 0 auto; }
	.floating {
		font-family: 'Source Code Pro', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
		background-color: #333;
		position: absolute;
		z-index: 5;
		left: 1rem;
		bottom: 3rem;
		max-height: 50%;
		overflow-y: auto;
		padding: 0.5rem;
	}
	pre {
		flex: 0 1 auto;
		overflow-y: auto;
		margin-bottom: 0.5rem;
		border-bottom: 2px solid;
		white-space: pre-wrap;
		white-space: -moz-pre-wrap;
		white-space: -pre-wrap;
		white-space: -o-pre-wrap;
		word-wrap: break-word;
	}
	textarea {
/*		resize: none;*/
/*		height: 1.25rem;*/
		resize: vertical;
		border: 1px solid transparent;
		color: #ddd;
		outline-color: transparent;
		background-color: #333;
	}
	textarea:focus {
		outline: none !important;
		border:1px solid #17c;
		outline-color: transparent;
		background-color: #222;
	}
	/* colors */
	.terminal {
		background-color: #111;
		background-color: #222;
	}
	pre {
		color: #ddd;
		background-color: #222;
		border-color: #333;
	}

</style>