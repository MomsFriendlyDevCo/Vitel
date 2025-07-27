<script>
/**
* Assign document level shortcut keys to perform an action locally
*
* @param {Object} An object of shortcut keys to function bindings e.g. (`{'ctrl+s': save}`) OR a full settings object with a `bindings` sub-object
* @param {Object} bindings Sub-bindings object, if omitted as key the entire settings object is used. Expected to contain shortcut key combinations to functions
* @param {String} [selector='body'] querySelector expression to locate the object to bind the event listener to
* @param {String} [method='keydown'] Method to bind to
* @param {Boolean} [stop=true] Stop the event when fired. Can be overriden with the `nodrop` directive modifier
* @param {Boolean} [prevent=true] Prevent default event bindings when the event is fired. Can be overriden with the `noprevent` directive modifier
* @param {Boolean} [drop=false] If no binding exists, prevent any key event being processed anyway - effectively blocks all unknown key presses. Can be enabled with the `drop` directive modifier
* @param {Function} [before] Async function to call as `(key:String)` before running the shortcut function
* @param {Function} [after] Async function to call as `(key:String)` after running the shortcut function
* @param {Function} [unhandled] Async function to call as `(key:String)` if no shortcut is present
*
* @example Bind various component level functions to shortcut keys
* <div v-shortcuts="
*   'ctrl+s': save,
*   'ctrl+p': print,
* ">
*
* @example Advanced example with bindings as a sub-object
* <div v-shortcuts="
*   selector: 'body > div', // Bind to first body > div` instead of main document body
*   bindings: {
*     'ctrl+s': save,
*     'ctrl+p': print,
*   },
* ">
*/
export default {
	created(el, binding) {
		bindVShortcut(el, binding);
	},
	updated(el, binding) {
		if (!el) return; // Skip updates to things that arn't mounted yet
		bindVShortcut(el, binding);
	},
}

/**
* Actual worker for the v-href directive
* @param {DOMElement} el DOM element to bind against
* @param {Object} binding Vue binding object to process
*/
let bindVShortcut = function vShortcutBind(el, binding) {
	let settings = {
		selector: 'body',
		method: 'keydown',
		stop: true,
		prevent: true,
		drop: false,
		before: ()=> {},
		after: ()=> {},
		unhandled: ()=> {},
		debug: false,
		...(
			typeof binding.value?.bindings == 'object' ? {bindings: binding.value.bindings, ...bindings.value} // Has `bindings` sub-key, assume its a full settings object
			: typeof binding.value == 'object' ? {bindings: binding.value} // Lazy bindings-only specification
			: (()=> { throw new Error('Expected an object of v-shortcut bindings') })()
		),
	};
	// Process modifiers into settings
	if (binding.modifiers.nostop) settings.stop = false;
	if (binding.modifiers.noprevent) settings.prevent = false;
	if (binding.modifiers.drop) settings.drop = true;
	if (binding.modifiers.debug) settings.debug = true;

	let bindEl = el.querySelector(settings.selector);
	if (!bindEl) throw new Error(`Unable to find suitable query selector "${settings.selector}" for v-shortcut`);

	bindEl.addEventListener(settings.method, async (e) => {
		let key = [
			e.altKey && 'alt',
			e.ctrlKey && 'ctrl',
			e.shiftKey && 'shift',
			e.code.toLowerCase(),
		].filter(Boolean).join('-'); // e.g. 'alt-ctrl-space'

		let hasShortcut = key in settings.bindings;

		if (hasShortcut || settings.drop) {
			if (settings.stop) e.stopPropagation();
			if (settings.prevent) e.preventDefaults();
		}

		if (hasShortcut) {
			if (settings.debug) console.log('v-shortcut detected shortcut key', key);
			await settings.before(key);
			await settings.bindings[key]();
			await settings.after(key);
		} else {
			if (settings.debug) console.log('v-shortcut detected UNHANDLED shortcut key', key);
			await settings.unhandled(key);
		}
	});
};
</script>
