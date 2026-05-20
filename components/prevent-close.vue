<script>
/**
* Component to programatically prevent a tab / browser session from being closed by the user
* This is typically used to prevent the user exiting a session with unsaved changes
*
* NOTE: Because of browser limitations the functionality here is very limited
*       1. If the user selects to terminate the session anyway, this behaviour cannot be prevented
*       2. The message shown to the user cannot be customized
*/
export default {
	data() { return {
		/**
		* Whether a watch is setup
		* @type {Boolean}
		*/
		isEnabled: false,
	} },
	props: {

		/**
		* If the user should be warned when trying to close this session
		* @type {Boolean|String|Number|Function} Either a truthy/falsy value or an async function to run to obtain one
		*/
		enabled: {
			type: [Boolean, String, Number, Function],
			default: true,
		},
	},
	methods: {
		/**
		* Install or destroy the active watcher
		* This function is called automatically when `$props.enabled` changes
		*
		* @param {Boolean} [enabled=true] Whether the watcher should be installed
		*/
		toggleWatcher(enabled = true) {
			console.log('ToggleWatcher?', enabled, 'handle=', this.unloadHandle, 'as-bool=' , !!this.unloadHandle);
			if (!enabled && this.isEnabled) { // Disabling
				window.removeEventListener('beforeunload', this.preventClose);
				this.isEnabled = false;
			} else if (enabled && !this.isEnabled) { // Enabling
				window.addEventListener('beforeunload', this.preventClose);
				this.isEnabled = true;
			} // Implied else - enabled changed to existing value - no action needed
		},


		/**
		* Actual function to handle the user trying to terminate the session
		*
		* @param {Event} e The beforeunload Event object
		*/
		preventClose(e) {
			e.preventDefault();
			e.returnValue = ''; // Required for some browsers
		},
	},
	watch: {
		enabled: {
			immediate: true,
			async handler() {
				let isEnabled = !!(typeof this.enabled == 'function' // Using a callback function?
					? (await this.enabled()) // Obtain response if we should wait
					: this.enabled // Cast other values into a boolean
				);
				this.toggleWatcher(isEnabled);
			},
		},
	},
}
</script>

<template>
	<div/>
</template>
