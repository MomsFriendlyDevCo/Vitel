<script>
/**
* Component to programatically prevent a tab / browser session from being closed by the user
* AND/OR navigating away from the current page (with Vue-Router)
*
* This is typically used to prevent the user exiting a session with unsaved changes
*
* NOTE: Because of browser limitations the functionality here is very limited
*       1. If the user selects to terminate the session anyway, this behaviour cannot be prevented
*       2. The message shown to the user cannot be customized in this case (only router guards have this option)
*/
export default {
	data() { return {
		/**
		* Whether a watch is setup for browser closure
		* @type {Boolean}
		*/
		isBrowserGuardEnabled: false,


		/**
		* Whether a watch is setup for router navigation
		* @type {Boolean}
		*/
		isRouterGuardEnabled: false,


		/**
		* Router guard uninstall function, used by toggleNavigationGuard()
		* @type {Function}
		*/
		uninstallRouterGuard: null,
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


		/**
		* Protect against tab or browser window closure
		* @type {Boolean} Whether to guard against page closes
		*/
		preventBrowserClose: {
			type: Boolean,
			default: true,
		},


		/**
		* Protect against Vue-Router navigation
		* @type {Boolean} Whether to guard against router navigation
		*/
		preventRouterNavigation: {
			type: Boolean,
			default: true,
		},


		/**
		* Message to show when the user tries to navigate away from the active page, asking for confirmation
		* Set this to falsy to disable asking and just prevent navigation
		* NOTE: This is only used for Router navigation, NOT browser closures which cannot be trapped
		* @type {String|Null}
		*/
		message: {
			type: String,
			default: 'You have unsaved changes, are you sure you wish to close this page?',
		},
	},
	methods: {

		/**
		* Install or destroy the active watcher for page closures
		* This function is called automatically when `$props.enabled` changes
		*
		* @param {Boolean} [enabled=true] Whether the watcher should be installed
		*/
		toggleBrowserGuard(enabled = true) {
			if (!enabled && this.isBrowserGuardEnabled) { // Disabling
				window.removeEventListener('beforeunload', this.preventClose);
				this.isBrowserGuardEnabled = false;
			} else if (enabled && !this.isBrowserGuardEnabled) { // Enabling
				window.addEventListener('beforeunload', this.preventClose);
				this.isBrowserGuardEnabled = true;
			} // Implied else - enabled changed to existing value - no action needed
		},


		/**
		* Actual function to handle the user trying to terminate the session
		*
		* @param {Event} e The beforeunload Event object
		*/
		preventClose(e) {
			e.preventDefault();
			console.log('<prevent-close/> - preventing Browser close');
			e.returnValue = ''; // Required for some browsers
		},


		/**
		* Install or destroy the Router guard preventing navigation
		* This function is called automatically when `$props.enabled` changes
		*
		* @param {Boolean} [enabled=true] Whether the watcher should be installed
		*/
		toggleRouterGuard(enabled = true) {
			if (!enabled && this.isRouterGuardEnabled) { // Disabling
				this.uninstallRouterGuard();
				this.isRouterGuardEnabled = false;
			} else if (enabled && !this.isRouterGuardEnabled) { // Enabling
				this.uninstallRouterGuard = this.$router.beforeEach((to, from) => {
					let preventNav = !this.message || !window.confirm(this.message); // Just say no if message is disabled OR ask the user first

					if (preventNav) {
						console.log('<prevent-close/> - preventing Vue-Router navigation');
						return false;
					}
				});
				this.isRouterGuardEnabled = true;
			} // Implied else - enabled changed to existing value - no action needed
		},
	},
	beforeUnmount() { // Ensure guards don't outlive this component
		this.toggleBrowserGuard(false);
		this.toggleRouterGuard(false);
	},
	watch: {
		enabled: {
			immediate: true,
			async handler() {
				let isEnabled = !!(typeof this.enabled == 'function' // Using a callback function?
					? (await this.enabled()) // Obtain response if we should wait
					: this.enabled // Cast other values into a boolean
				);
				this.toggleBrowserGuard(isEnabled && this.preventBrowserClose);
				this.toggleRouterGuard(isEnabled && this.preventRouterNavigation);
			},
		},
	},
}
</script>

<template>
	<div/>
</template>
