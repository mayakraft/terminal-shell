<!--
	this is not really a "visible" component,
	more of a data model, but still a svelte component,
	because the other svelte components need to access its data.
-->
<script>
	// libraries available to the terminal
	import ear from "rabbit-ear";
	export let history = [];
	// any mutable variables shared in the app
	export let origami = {};
	/**
	 * @description update the history with 2 items: the command executed, the result.
	 */
	const updateHistory = (command, result) => {
		const newHistory = [{ type: "input", value: command }];
		newHistory.push(result.error
			? { type: "error", value: result.errror }
			: { type: "output", value: result.value });
		history = history.concat(newHistory);
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
			result.value = eval(command);
			// success. update any mutable app variables
			origami = origami;
		} catch (error) {
			result.error = error;
		}
		updateHistory(command, result);
		return result;
	};
</script>
