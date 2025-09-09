<script>
import timestring from 'timestring';

/**
* Simple component which either fetches a single point of data from the server and displays it OR allows a slot wrapper for the fetched data
* This component also has automatic lazy loading - the component only fetches data when its actually visible rather than triggering on page load
*
* @param {String|Object} [url] The URL or AxiosRequest to fetch data (instead of specifying `collection` + `id`)
* @param {String} [field="title"] Field to display the title of, if using slots specify "*" to populate `data` with the raw data object
* @param {Function|String} [filter] Optional function filter or named Vue filter to run the result through before outputting
* @param {String} [cache] Simple cache-for-x caching for the digest endpoint, prevents refreshing if the component gets hydrated. Can be any `timestring()` parsable value
* @param {Function} [cacheKey] Cache key within sessionStorage to use, defaults to `digest-${url}`. Called as `(instance:VueComponent)`
* @param {String} [label] Use this label before fetching a remote one, if specifed the entity is treated as valid (including valid class and icon)
* @param {Boolean} [lazy=true] If true, fetching will be defered until the element is actually shown within the content area
* @param {String} [lazyParents='#content, #main, body'] jQuery compatible string listing the intersection parents to probe for when lazy==true, the first one found is assumed to be the parent
* @param {String} [lazyParentsDisable='.modal'] jQuery compatible string which, if matched disables lazy loading (defaults to inside modals by default)
* @param {String} [classValid] Apply this class to the element if the returned value is truthy
* @param {String} [classInvalid] Apply this class to the element if the return value is falsy
* @param {String|function} [textValid] Either overriding text to display if the element is valid, or a function to call with the server response which returns the mangled output
* @param {String|function} [textInvalid] As with `textValid` this is either overriding text or a function to mangle a server response
* @param {String} [iconValid] Optional icon to display next to the context when loaded
* @param {String} [iconInvalid] Optional icon to display next to the `textInvalid` text when an error occurs
* @param {Boolean} [ignoreErrors=false] Ignore all thrown errors, if false they will be routed into this.$toast.catch
* @param {String} [hashMethod='urlField] How to cache the digest result, see the `$http.throttle` function for more info
* @param {*} [hash] Optional pre-computed hash if using `{hashMethod:'custom'}`
* @param {*} [httpWrapper='throttle'] Key within `$http` to use when making requests. ENUM: 'request', 'throttle'
*
* @slot [loading] What to display when loading - defaults to a FA5 loading spinner. Bindings are `{config}`
* @slot [display] What to display when data is loaded. Bindings are `{config, data, displayContent}`
*
* @example Pull in a full data record and template the responses
* <digest
*   field="*"
*   :url="`/api/widgets/${input.file}`"
* >
*   <template #loading>
*     <i class="far fa-spinner fa-spin"/>
*     Loading widget information...
*   </template>
*   <template #display="{data: widget}">
*     <strong class="d-block">{{widget.title}}</strong>
*     <small class="d-block">{{widget.description}}</small>
*   </template>
* </digest>
*/
export default {
	data() { return {
		data: undefined,
		displayContent: '',
		displayClass: undefined,
		isLazy: false,
		loading: true,
		useLabel: true, // Whether to display the $props.label content if its present, set to false on incomming events or overrides
	}},
	props: {
		url: {type: [Object, String], required: true},
		field: {type: String, default: "title"},
		filter: {type: [Function, String]},
		cache: {type: String},
		cacheKey: {type: Function, default() {
			return [
				'digest',
				typeof this.url == 'string' ? this.url
				: typeof this.url == 'object' ? this.url.url
				: this.cache && (()=> { throw new Error('Cannot determine cache key - must specify an alternate <digest :cache-key="Function"/> binding') })(),
			].join('-');
		}},
		label: {type: String},
		lazy: {type: Boolean, default: true},
		lazyParents: {type: String, default: '#content, #main, body'},
		lazyParentsDisable: {type: String, default: '.modal'},
		classValid: {type: String},
		classInvalid: {type: String},
		textValid: {type: [String, Function]},
		textInvalid: {type: [String, Function]},
		iconValid: {type: String},
		iconInvalid: {type: String},
		ignoreErrors: {type: Boolean, default: false},
		hashMethod: {type: String, defualt: 'url+field', validator: v => ['url', 'url+field', 'request', 'custom'].includes(v)},
		hash: {type: String},
		httpWrapper: {type: String, default: 'throttle'},
	},
	methods: {
		refresh() {
			this.loading = true;
			if (this.useLabel && this.label) { // Use label instead of fetching remote?
				this.displayContent = this.label;
				this.displayIcon = this.iconValid;
				this.loading = false;
			} else { // Fetch remote data
				return Promise.resolve()
					.then(()=> { // Use caching?
						if (!this.cache) return; // Cache disabled - fall through

						let cacheKey = this.cacheKey.apply(this, this);
						let cacheItem = globalThis.sessionStorage.getItem(cacheKey);
						if (cacheItem) { // Have a cache Item
							let now = new Date();
							cacheItem = JSON.parse(cacheItem);
							if (cacheItem.expires < now) { // Cache item has expired
								globalThis.sessionStorage.removeItem(cacheKey); // Expire key
								return; // Exit out
							}
							return cacheItem.data; // Extract data and use that
						} // implied else - no cache - fall through to fetching the fresh data
					})
					.then(cacheData => cacheData || this.$http[this.httpWrapper]({
						method: 'GET',
						url: this.url,
						hashMethod: this.hashMethod,
					})
						.then(({data}) => data)
						.then(data => { // Optionally cache data for next time
							if (!this.cache) return data;

							let cacheKey = this.cacheKey.apply(this, this);
							globalThis.sessionStorage.setItem(cacheKey, JSON.stringify({
								expires: new Date(Date.now() + timestring(this.cache, 'ms')),
								data,
							}));

							return data;
						})
					)
					.then(data => { // Reduce to requested field if specified
						if (this.field == '*' && data) {
							return data;
						} else if (this.field && this.field != '*' && data[this.field] !== undefined) {
							return data[this.field];
						} else if (this.field && this.field != '*') {
							console.trace(`Data from URL ${this.url} does not contain field "${this.field}"`, data);
						} else {
							return data;
						}
					})
					.then(value => {
						this.data = value;
						this.displayContent = typeof this.textValid == 'string' ? this.textValid
							: typeof this.textValid == 'function' ? this.textValid(value)
							: value;

						if (this.filter) {
							if (typeof this.filter == 'function') {
								this.displayContent = this.filter(this.displayContent) // As func(v)
							} else if (typeof this.filter == 'string') {
								var filter = this.$filters[this.filter];
								if (!filter) throw new Error(`Unknown filter "${this.filter}" specified in <digest filter/>`);
								this.displayContent = filter(this.displayContent); // As named filter
							} else {
								throw new Error(`Unknown filter type specified in <digest filter/>`)
							}
						}

						this.displayIcon = this.iconValid;
						if (this.classValid) this.displayClass = this.classValid;
					})
					.catch(err => {
						this.displayContent = typeof this.textInvalid == 'string' ? this.textInvalid
							: typeof this.textInvalid == 'function' ? this.textInvalid(err)
							: err.statusText ? err.statusText
							: err;
						this.displayIcon = this.iconInvalid;
						if (this.classInvalid) this.displayClass = this.classInvalid;
						if (!this.ignoreErrors) this.$toast.catch(err);
					})
					.finally(()=> this.loading = false)
			}
		},
	},
	mounted() {
		// Check we can use Lazy observing
		if (this.$el.closest(this.lazyParentsDisable)) this.isLazy = false;

		// Bind an interesection observer to fire a callback when the element appears on screen {{{
		if (this.isLazy) {
			var intersectionObserver = new IntersectionObserver(()=> {
				this.refresh();
				intersectionObserver.disconnect();
				intersectionObserver = null;
			}, {
				root: this.$el.closest(this.lazyParents),
				rootMargin: '100px',
				threshold: 0.1,
			});
			intersectionObserver.observe(this.$el);
		} else {
			this.refresh();
		}
		// }}}
	},
	watch: {
		url() { // Update when URL changes
			this.refresh();
		},
	},
};
</script>

<template>
	<div class="digest">
		<slot
			v-if="loading"
			name="loading"
			:config="$props"
		>
			<i class="fas fa-spinner fa-spin"/>
		</slot>
		<slot
			v-else
			name="display"
			:config="$props"
			:data="data"
			:display-content="displayContent"
		>
			<div :class="displayClass">
				<i v-if="displayIcon" :class="displayIcon"/>
				{{displayContent}}
			</div>
		</slot>
	</div>
</template>
