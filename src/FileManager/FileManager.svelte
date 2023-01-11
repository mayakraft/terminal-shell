<script>
	export let files = [];
	// files loaded after each drag event (supports multiple file upload)
	let batch = [];
	// hold onto each FileReader() so that after loading, we can
	// match the contents up with the file's metadata.
	let fileReaders = [];
	// counter will decrement after each load. 0 means all files are loaded.
	let asyncCount = 0;

	const removeExtension = (str) => {
		const matches = str.match(/(.*)\.[^.]+$/);
		return matches === null ? str : matches[1];
	};

	const getExtension = (str) => {
		const matches = str.match(/[0-9a-z]+$/);
		return matches === null ? "" : matches[0].toLowerCase();
	};

	const formatName = (str) => str
		.replaceAll(/[-+^!@#$%~\*\&`\(\)\ ]/g,"")
		.replaceAll(".", "_");

	export const loadFiles = (event) => {
		if (event.dataTransfer.items) {
			asyncCount = event.dataTransfer.items.length;
			const transferFiles = [...event.dataTransfer.items]
				.filter(el => el.kind === "file")
				.map(el => el.getAsFile());
			batch = transferFiles.map(getMetadata);
			fileReaders = transferFiles.map((el, i) => loadFile(el, batch[i]));
		}
		// else if (event.dataTransfer.files) {
		//  // Use DataTransfer interface to access the file(s)
		//  [...event.dataTransfer.files].forEach((file, i) => {
		//    console.log(`… 2.0 file[${i}].name = ${file.name}`);
		//  });
		// }
	};

	const getMetadata = (file) => ({
		type: file.type,
		name: formatName(removeExtension(file.name)),
		extension: getExtension(file.name),
		filename: file.name,
		size: file.size,
		lastModified: file.lastModified,
		url: (window.URL || window.webkitURL).createObjectURL(file),
		contents: undefined,
	});

	const fileOnLoad = (event) => {
		const match = fileReaders
			.map((el, i) => (el === event.originalTarget ? i : undefined))
			.filter(el => el !== undefined)
			.shift();
		if (match === -1) {
			console.warn("load file interrupted");
			return;
		}
		if (batch[match].type === "application/json") {
			try {
				batch[match].contents = JSON.parse(event.target.result);
			} catch (error) {
				batch[match].contents = event.target.result;
			}
		} else {
			batch[match].contents = event.target.result;
		}
		asyncCount -= 1;
		// finished async loading all files
		if (asyncCount === 0) {
			files = files.concat(...batch);
		}
	};

	const readData = (file) => {
		const reader = new FileReader();
		reader.onload = fileOnLoad;
		reader.readAsArrayBuffer(file);
		// reader.readAsDataURL(file);
		return reader;
	};

	const readText = (file) => {
		const reader = new FileReader();
		reader.onload = fileOnLoad;
		reader.readAsText(file);
		return reader;
	};

	const loadFile = (file, metadata) => {
		const mimeParts = file.type.split("/");
		// split the mime type into two parts and reference only the first
		switch (mimeParts[0]) {
		case "image":
		case "audio":
		case "video":
		case "font":
			return readData(file);
		case "text":
			return readText(file);
		case "application":
			// need to consult specific mime types for "application"
			switch (file.type) {
				case "application/json": return readText(file);
				case "application/pdf": return readData(file);
				default: return readData(file);
			}
		default:
			switch (metadata.extension) {
				case "opx": return readText(file);
				// default: return readData(file);
				default: return readText(file);
			}
		}
	};

</script>
