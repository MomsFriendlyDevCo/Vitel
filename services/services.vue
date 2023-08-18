<script>
import Service from './service.js';

export default {
	name: '$services',
	data() { return {
		/**
		* Object lookup of all loaded services
		* @type {Object}
		*/
		services: {},
	}},
	props: {
		/**
		* The main VueApp object
		* @type {VueApp}
		*/
		app: {type: Object, required: true},
	},
	methods: {
		/**
		* Lazily load a service
		* @param {String|Object} service The name of the service to load or the Vue component spec
		* @param {Object} [options] Additional options to mutate behaviour
		* @returns {Promise} A promise which resolves when the service has loaded
		*/
		load(service, options) {
			let settings = {
				force: false,
				...options,
			};

			console.log('Lazy load service', service);
			if (!settings.force && typeof service == 'string' && this.services[service]) return Promise.resolve(); // Service already loaded
			return Promise.resolve()
				.then(()=> typeof service == 'string' ? import(service /* @vite-ignore */) : service)
				.then(component => Service(component, {
					app: this.app,
					...settings,
				}))
		},
	},
}
</script>