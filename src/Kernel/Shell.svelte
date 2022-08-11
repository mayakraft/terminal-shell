<script>
	// libraries available to the terminal
	import ear from "rabbit-ear";
	export let history = [];
	// any mutable variables shared in the app
	export let origami = {};
	/**
	 * @description execute a command within the "kernel" of this app.
	 * the command and its result will be printed to the terminal.
	 * @returns {object} with two keys:
	 * - "result": {any} result of calling eval(), or undefined if there is an error
	 * - "error": Error() if exists, undefined if there is no error
	 */
	export const exec = (command) => {
		try {
			const result = eval(command);
			// update any mutable app variables
			origami = origami;
			// update history
			history = history.concat([
				{ type: "input", value: command },
				{ type: "output", value: result },
			]);
			return { result, error: undefined };
		} catch (error) {
			history = history.concat([
				{ type: "input", value: command },
				{ type: "error", value: error },
			]);
			return { result: undefined, error };
		}
	};
</script>
