<script>
	import example from "../example.json";
	let files;
	export let fileDidLoad = () => {};
	export let exec;
	export let viewMode = "svg";

	const fileDialogDidLoad = (string, filename, mimeType) => {
		let result = { value: undefined, error: undefined };
		try {
			result.value = JSON.parse(string);
		}
		catch(error) {
			result.error = error;
		}
		fileDidLoad(result);
	};

	$: if (files) {
		const file = files[0];
		let mimeType, filename;
		const reader = new FileReader();
		reader.onload = loadEvent => fileDialogDidLoad(loadEvent.target.result, filename, mimeType);
		if (files.length) {
			mimeType = files[0].type;
			filename = files[0].name;
			reader.readAsText(files[0]);
		}
	}
</script>

<input type="file" bind:files>
<hr />
	<input
		type="radio"
		name="radio-view"
		value="radio-view-svg"
		on:click={() => viewMode = "svg"}
		checked={viewMode==="svg"}>
	<label for="radio-view-svg">svg</label>
	<input
		type="radio"
		name="radio-view"
		value="radio-view-webgl"
		on:click={() => viewMode = "webgl"}
		checked={viewMode==="webgl"}>
	<label for="radio-view-webgl">webgl</label>
<hr />
<button on:click={() => exec(`origami = ear.cp.kite()`)}>origami = ear.cp.kite</button>
<button on:click={() => exec(`origami = ${JSON.stringify(example)}`)}>origami = example</button>
<hr />
<button on:click={() => exec(`ear.graph.fragment(origami)`)}>fragment</button>
<button on:click={() => exec(`ear.graph.populate(origami)`)}>populate</button>
<button on:click={() => exec(`ear.graph.clean(origami)`)}>clean</button>
<button on:click={() => exec(`ear.graph.count.vertices(origami)`)}>count.vertices</button>
<button on:click={() => exec(`ear.graph.count.edges(origami)`)}>count.edges</button>
<button on:click={() => exec(`ear.graph.count.faces(origami)`)}>count.faces</button>
<button on:click={() => exec(`ear.graph.getBoundary(origami)`)}>getBoundary</button>
<button on:click={() => exec(`ear.graph.getBoundingBox(origami)`)}>getBoundingBox</button>
<button on:click={() => exec(`ear.graph.rotateZ(origami, Math.PI/2)`)}>rotateZ 90</button>
<button on:click={() => exec(`ear.graph.rotateZ(origami, Math.PI/4)`)}>rotateZ 45</button>
<button on:click={() => exec(`ear.graph.validate(origami)`)}>validate</button>
<button on:click={() => exec(`ear.graph.validate(origami).summary`)}>validate summary</button>
