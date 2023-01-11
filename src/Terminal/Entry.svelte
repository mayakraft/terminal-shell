<script>
	export let data;

	export let alertCopiedKey;

	const getCircularReplacer = () => {
		const seen = new WeakSet();
		return (key, value) => {
			if (typeof value === "object" && value !== null) {
				if (seen.has(value)) { return; }
				seen.add(value);
			}
			return value;
		};
	};

	const dataTypeof = data ? typeof data.value : undefined;

	let outputObjectStringified = "";

	if (data && data.type === "output" && dataTypeof === "object") {
		try {
			outputObjectStringified = JSON.stringify(data.value);
		}
		catch (error) {
			try {
				outputObjectStringified = JSON.stringify(data.value, getCircularReplacer());
			} catch (error2) {
				outputObjectStringified = "invalid object";
			}
		}
	}

	const formatInputValue = (value) => {
		// console.log("data type value", typeof value, value);
		switch (typeof value) {
		case "object": return JSON.stringify(value, getCircularReplacer());
		case "boolean":
		case "number":
		case "string":
		case "function":
		default: return value;
		}
	};

	const copyToClipboard = () => {
		alertCopiedKey = Math.random();
		navigator.clipboard.writeText(outputObjectStringified);
	};

</script>

<!-- whitespace is weird in this section -->
<!-- because this is embedded in a <pre> -->

	<!-- {console.log(data.value)} -->

{#if data && data.type === "input"}
<span class={data.type}>{formatInputValue(data.value)}</span>{/if}{#if data && data.type === "error"}
<span class={data.type}>{formatInputValue(data.value.message)}</span>{/if}{#if data && data.type === "output"}
{#if dataTypeof === "boolean"}
<!-- <span class={`${data.type} ${dataTypeof}`}>{data.value}</span> -->
<span class={`output boolean`}>{data.value}</span>
{:else if dataTypeof === "number"}
<span class={`output number`}>{data.value}</span>
{:else if dataTypeof === "string"}
<span class={`output string`}>{data.value}</span>
{:else if dataTypeof === "function"}
<div class="right"><button class="function">function</button></div>
{:else if dataTypeof === "object"}
{#if outputObjectStringified.length > 500}
<span class={`output object`}>{outputObjectStringified.slice(0,200)}...</span>
{:else}
<span class={`output object`}>{outputObjectStringified}</span>
{/if}
<div class="right"><button class="object" on:click={copyToClipboard}>object</button></div>
{/if}
{/if}

<style>
	span { display: inline-block; }
	span.output {
		font-weight: bold;
		color: #777;
	}
	span.error { color: #e53; }
	span.output.boolean,
	span.output.number { color: #48c; }
	div.right {
		text-align: right;
		margin-top: -2rem;
		z-index: 5;
	}
	button {
		margin: 0.25rem;
		padding: 0.25rem;
		background-color: #333;
		color: #999;
		border-radius: 0.25rem;
		border: 1px solid #777;
		box-shadow: 0 0 1rem 0.5rem #222;
	}
	button:hover {
		cursor: pointer;
		color: #fb4;
		border-color: #fb4;
	}
</style>
