<script>
/**
* Vitel service to provide clipboard functionality
*/
export default {
	name: '$clipboard',
	methods: {

		/**
		* Copy data to the system clipboard, optionally displaying a toast when ready
		*
		* @param {String} data The content to copy
		*
		* @param {Object} [options] Additional options to mutate behaviour
		* @param {Boolean|String} [options.toast='Copied to clipboard'] Toast content to display, set to falsy to disable
		*
		* @returns {Promise} A promise which resolves when the operation has completed
		*/
		copy(data, options) {
			let settings = {
				toast: 'Copied to clipboard',
				...options,
			};

			return Promise.resolve()
				.then(()=> {
					if (typeof data == 'string') {
						return navigator.clipboard.writeText(data);
					} else {
						throw new Error(`Unhandled $clipboard.copy() type "${typeof data}"`);
					}
				})
				.then(()=> {
					if (!settings.toast) return;
					this.$toast.success(settings.toast);
				})
		},
	},
	created() {
		return this.$services.require('$toast');
	},
}
</script>
