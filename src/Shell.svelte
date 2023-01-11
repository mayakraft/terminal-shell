<script>
/**
 * this is not a visible component,
 * more of a data model, but still a Svelte component,
 * because the other svelte components need to access its data.
 */

	// libraries available to the terminal
	import rabbitEarLibrary from "rabbit-ear";
	export let history = [];
	export let files = [];

	const ear = Object.assign({}, rabbitEarLibrary);

	// the context which will bind to the Function's this.
	const context = { ear }; // document;
	/**
	 * @description update the history with 2 items: the command executed, the result.
	 */
	const updateHistory = (command, result) => {
		const newHistory = [{ type: "input", value: command }];
		newHistory.push(result.error
			? { type: "error", value: result.error }
			: { type: "output", value: result.value });
		history = history.concat(newHistory);
	};

	const scopedEval = (scope, script, result) => {
		// return (new Function(script)).call(this);
		const fileString = files
			.map(f => `var ${f.name} = this.${f.name};`).join("");
		try {
			return Function(`var ear = this.ear; ${fileString} return ${script}`).bind(scope)();
		} catch (e) {
			try {
				return Function(`var ear = this.ear; ${fileString} ${script}`).bind(scope)();
			} catch (error) {
				result.error = error;
			}
		}
	};
	/**
	 * @description execute a command within the "kernel" of this app.
	 * the command and its result will be printed to the terminal.
	 * @returns {object} with two keys:
	 * - "result": {any} result of calling eval(), or undefined if there is an error
	 * - "error": Error() if exists, undefined if there is no error
	 */
	export const exec = (command) => {
		const result = { value: undefined, error: undefined };
		try {
			files.forEach(f => { context[f.name] = f.contents; });
			result.value = scopedEval(context, command, result);
		}
		catch (error) {
			result.error = error;
		}
		updateHistory(command, result);
		return result;
	};
</script>
