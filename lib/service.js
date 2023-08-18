import {createApp, nextTick} from 'vue';

/**
* Mount a component object as a singleton VueComponent, returning the result
*
* @param {Object|VueComponent} component The component specification to use as a service
* @param {Object} options Additional options to mutate behaviour
* @param {VueApp} options.app The global Vue App to mount against, only relevent if `global` is truthy
* @param {Boolean} [options.global=true] Setup the service as globally available by adding it to the prototype object accessible to all Vue components, requires `options.app`
* @param {String} [options.name] Overriding name to use for the service, otherwise the services own name will be used
* @param {Boolean} [options.wrapInit=true] If the component provides an `init` method, add `{data: {ready: Boolean}, methods: {promise: Function<Promise>}}` helpers
* @param {Boolean} [options.init=true] Run the init function if one is present
* @param {Object} [options.extend] Optional extensions to mixin to the existing service component, mainly used internally
* @param {Object} [options.props] Props to populate the loaded service
* @param {Boolean} [options.autoProps=true] If `options.props` is empty, pick all properties from options that arn't any of the settings listed there
*/
export default function Service(component, options) {
	let defaults = {
		app: null,
		global: true,
		name: component.name,
		wrapInit: true,
		init: true,
		extend: {
			data: {},
			props: {},
			methods: {},
			mixins: [],
			render: ()=> null, // No-op rendering wrapper
		},
		props: {},
		autoProps: true,
	};
	let settings = {...defaults, ...options};

	// Settings sanity checks {{{
	if (!component.name) throw new Error('All Vitel service components must specifiy a name');
		if (!/^\$[_\w]+$/i.test(component.name)) throw new Error('Service names must start with a dollar symbol + contain A-Z + "_" symbols');

	if (!settings.app) throw new Error('Cannot resolve global Vue App instance');
	if (!settings.name) throw new Error('Cannot determine usable name for service');
	// }}}

	// Wrap .init() -> ready + promise() (if settings.wrapInit()) {{{
	if (settings.wrapInit && component.methods?.init) {
		// Extend .data export with {ready:Boolean}
		settings.extend.data.ready = false;

		// Extend .methods with {promise:Function<Promise>}
		component.methods.promise = function promise() {
			if (this.init.promise) return this.init.promise; // Promise already pending

			return this.init.promise = Promise.resolve(this.init())
				.finally(()=> this.ready = true)
		};
	}
	// }}}

	// Create fake mounting DOM element {{{
	let mountEl = document.createElement('div');
	mountEl.id = component.name;
	document.body.appendChild(mountEl);
	// }}}

	// Apply settings.extend.data {{{
	if (settings.extend.data && Object.keys(settings.extend.data).length > 0) {
		let existingData = (component.data && component.data.call(this)) || {};
		component.data = function() { // Wrap existing data function return in an outer funciton which adds our extensions
			return {
				...existingData, // Mix-in existing data (if any)
				...settings.extend.data, // Add our mixins
			};
		};
	}
	// }}}
	// Apply settings.extend.methods {{{
	if (settings.extend.methods && Object.keys(settings.extend.methods).length > 0) {
		component.methods = {
			...service.methods, // Copy existing methods
			...settings.extend.methods, // Add our mixins
		};
	}
	// }}}
	// Apply settings.extend.mixin {{{
	if (settings.extend.mixins && settings.extend.mixins.length > 0) {
		component.mixins = [
			...component.mixins ?? [],
			...settings.extend.mixins,
		];
	}
	// }}}
	// Apply settings.extend.FUNCTIONs {{{
	Object.entries(settings.extend)
		.filter(([key, val]) => typeof val == 'function' && !component[key])
		.forEach(([key, cb]) => component[key] = cb);
	// }}}
	// Compute props + Apply settings.props {{{
	let props =
		Object.keys(settings.props).length > 0 ? settings.props // Use provided props
		: settings.autoProps ? (() => { // Extract not-specific keys from options and use those
			let defaultKeys = new Set(Object.keys(defaults));

			return Object.fromEntries(
				Object.entries(settings).filter(([key]) => !defaultKeys.has(key))
			);
		})()
		: {};

	// Glue settings.props + app object to component props
	props = {
		...props,
		...settings.props,
		app: settings.app, // Optional subscription to the app object if the component requests it
	};
	// }}}

	// Create a Vue app and intialize it against the above DOM element {{{
	let service = createApp(component, props).mount(mountEl);
	// }}}

	// Add as a global service (if settings.app && settings.global) {{{
	if (settings.app && settings.global) {
		settings.app.config.globalProperties[settings.name] = service;
	}
	// }}}

	// Add registered component to $services.services {{{
	if (settings.app.$service)
		settings.app.$service.services[settings.name] = settings.app.$service[settings.name] = service;
	// }}}

	// Call .init() (if settings.init) {{{
	if (typeof service.init == 'function')
		nextTick(()=> service.init.call(service));
	// }}}

	return service;
}