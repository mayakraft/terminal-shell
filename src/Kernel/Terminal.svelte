<script>
	import { onMount, afterUpdate } from "svelte";
	export let exec = () => {};
	export let history = [];

	const oninput = (e) => {
		const char = e.target.value[e.target.value.length - 1];
		if (char === undefined) { return; }
		switch (char) {
			case "\n":
				// todo, check if space is pressed.
				const command = e.target.value.substring(0, e.target.value.length - 1);
				// const newHistory = [{ type: "input", value: command }];
				const executed = exec(command);
				// const newHistory = executed.error
				// 	? [
				// 		{ type: "input", value: command },
				// 		{ type: "error", value: executed.error },
				// 	]
				// 	: [
				// 		{ type: "input", value: command },
				// 		{ type: "output", value: executed.result },
				// 	];
				// // if (output) { newHistory.push({ type: "output", value: output }); }
				// history = history.concat(newHistory);
				e.target.value = "";
			break;
		}
	};

	onMount(() => {
		const textareaRef = document.querySelector(".terminal textarea");
		// if (preRef) { preRef.scrollTop = preRef.scrollHeight; }
		if (textareaRef) { textareaRef.focus(); }
	});

	afterUpdate(() => {
		const preRef = document.querySelector(".terminal pre");
		if (preRef) {
			preRef.scrollTop = preRef.scrollHeight;
		}
	});
</script>

<div class="terminal">
	<pre>{#each history as el}<span class={el.type}>{el.value}</span>
{/each}</pre>
	<textarea
		autocomplete="off"
		autocorrect="off"
		rows="1"
		on:input={oninput}
	/>
</div>

<style>
	pre span { display: inline-block; }
	pre span.output { color: #777; }
	pre span.error { color: #e53; }
	.terminal {
		grid-column: 1/2;
		grid-row: 2/3;
		display: flex;
		flex-direction: column;
		/*box-sizing: border-box;*/
		flex: 1 0 auto;
		margin: 0.25rem;
		display: flex;
		flex-direction: column;
	}
	pre {
		flex: 0 1 auto;
		overflow-y: auto;
		margin: 0.5rem 0.5rem 0rem 0.5rem;
		border-bottom: 2px solid;
	}
	pre {
		white-space: pre-wrap;       /* css-3 */
		white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
		white-space: -pre-wrap;      /* Opera 4-6 */
		white-space: -o-pre-wrap;    /* Opera 7 */
		word-wrap: break-word;       /* Internet Explorer 5.5+ */
	}
	textarea {
		margin: 0 0.5rem 0rem 0.5rem;
		resize: none;
		height: 1.25rem;
		border: 0;
	}

	/* colors and style */
	.terminal {
		background-color: #111;
		border: 0.2rem solid #999;
		border-radius: 0.5rem;
		background-color: #222;
	}
	pre {
		color: #ddd;
		background-color: #222;
		border-color: #333;
	}
	textarea {
		color: #ddd;
		outline-color: transparent;
		background-color: #333;
	}
	textarea:focus {
		outline-color: transparent;
		background-color: #222;
	}

</style>