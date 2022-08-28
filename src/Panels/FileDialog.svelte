<script>
	import craneText from "../example.fold?raw";
	import MoosersTrainText from "../MoosersTrain.fold?raw";
	let files;
	export let fileDidLoad = () => {};
	export let exec;

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
<button on:click={() => exec(`origami = ear.cp.kite()`)}>origami = ear.cp.kite</button>
<!-- <button on:click={() => exec(`origami = ${craneText}`)}>origami = example</button> -->
<button on:click={() => fileDialogDidLoad(craneText)}>origami = crane</button>
<!-- <button on:click={() => fileDialogDidLoad(MoosersTrainText)}>origami = Mooser's-Train</button> -->
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
