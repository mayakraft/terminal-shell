import earDir from "./rabbit-ear.json";

const autocompleteMatch = (userInput) => {
	// take this next line away to default show "ear"
	if (userInput === "") { return {}; }
	const levels = userInput.split(".");
	let obj = { children: { ear: earDir } };
	try {
		// iterate through all but the final level
		levels.slice(0, -1)
			.forEach(level => { obj = obj.children[level]; });
	} catch (error) {}
	if (typeof obj === "object") {
		try {
			return Object.keys(obj.children)
				.filter(key => key.match(levels[levels.length - 1]) !== null)
				.reduce((cur, key) => Object.assign(cur, { [key]: obj.children[key] }), {});
		} catch (error) {}
	}
	return {};
};

export default autocompleteMatch;
