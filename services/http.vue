<script>
import axios from 'axios';
import hasher from 'object-hash';
import {isEqual, merge, omit} from 'lodash-es';
import timestring from 'timestring';

/**
* Axios wrapper
*
* @param {Object} [config] Base config to merge into axios.defaults
*
* @url https://github.com/axios/axios#example
*
* @example Load the HTTP module with a sane baseUrl + credential headers
* import HttpService from '@momsfriendly/vitel/services/http';
* app.service('$http', HttpService, {
*   debug: true, // Enable debugging if you want more verbosity
*   config: {
*     baseURL: 'http://localhost:8080',
*     withCredentials: true,
*   },
* });
*
* @example Make a GET request and process the (array'd) document body)
* vm.$http.get('/api/widgets')
*   .then(({data}) => data)
*
* @example Make a complex request
* vm.$http.request({
*   method: 'PUT',
*   headers: {'My Custom Header': 123},
*   params: {id: 123},
*   data: {someData: 'someValue'},
* })
*/
export default {
	name: '$http',
	data() { return {
		/**
		* Axios instance we're wrapping
		* @type {Axios}
		*/
		axios: axios.create(),

		/**
		* Hash->request lookup for requests being made against their resolving promise
		* @type {Object<Promise>}
		*/
		throttles: {},


		/**
		* Cache handles we have open
		* @type {Object<Cache>}
		*/
		caches: {},
	}},
	props: {

		/**
		* Default AxiosRequest object to assume in all cases
		* @type {Object}
		*/
		config: {type: Object},


		/**
		* Rewrite thrown Error objects when the response has a `text` component
		* This condition should apply to most `res.sendStatus(400)` / `res.send('Nope').status(400)` type responses
		* @type {Boolean}
		*/
		rewriteTextErrors: {type: Boolean, default: true},


		/**
		* Rewrite thrown Error objects when the response has `data.error` string value
		* This condition should apply to most `res.send({error: 'Nope}).status(400)` type responses
		* @type {Boolean}
		*/
		rewritePayloadErrors: {type: Boolean, default: true},
	},
	methods: {
		delete(...args) { return this.axios.delete(...args) },
		get(...args) { return this.axios.get(...args) },
		head(...args) { return this.axios.head(...args) },
		options(...args) { return this.axios.options(...args) },
		patch(...args) { return this.axios.patch(...args) },
		post(...args) { return this.axios.post(...args) },
		put(...args) { return this.axios.put(...args) },
		request(...args) { return this.axios.request(...args) },


		/**
		* Similar to a regular Axios.request() except that incoming requests are throttled if they match a given hash + expiry period
		*
		* @param {AxiosRequest} [config] The request to make
		* @param {String} [config.hashMethod='url'] How to hash the response. ENUM: 'url', 'query', 'request', 'custom'
		* @param {*} [config.hash] Precomputed hash if using `{hashMethod:'custom'}`
		* @param {String} [config.cachePrefix='http-'] Prefix to use when stashing HTTP cache responses
		*
		* @returns {Promise<AxiosResponse>} Either the regular resolved AxiosResponse or the existing value by hash
		*/
		throttle(config) {
			if (typeof config != 'object') throw new Error(`$http.throttle only accepts an AxiosRequest object "${typeof config}" given`);

			let hashMethod = config.hashMethod || 'url';
			let hash =
				hashMethod == 'url' ? hasher(config.url)
				: hashMethod == 'query' ? hasher({url: config.url, params: config.params, data: config.data})
				: hashMethod == 'request' ? hasher(config)
				: hashMethod == 'custom' && typeof config.hash == 'string' && /^\w+$/.test(config.hash) ? config.hash // Given a hash and it looks valid
				: hashMethod == 'custom' ? hasher(config.hash) // Don't trust it, run via hash() instead
				: (()=> { throw new Error(`Invalid $http.throttle hashMethod "${hashMethod}"`) })()

			let reqPrefix = `${config.method || 'GET'} ${config.url} ~ HASH[${hash}]`;
			if (this.throttles[hash]) { // Already making the request?
				// Request is already being made - return the pending promise;
				this.debug(reqPrefix, 'Reuse pending request');
				return this.throttles[hash];
			} else if (this.$cache?.get) { // $cache service is available - ask that
				return this.$cache.get((config.cachePrefix ?? 'http-') + hash, null)
					.then(val => {
						if (val !== null) { // Cache returned a value - use it
							return val;
						} else {
							this.debug(reqPrefix, 'Make fresh throttled request - no $cache value available');
							return this.throttles[hash] = this.axios.request(config)
								.finally(()=> { // Resolved - remove from pending list
									delete this.throttles[hash];
								})
						}
					})
			} else { // Give up and make the request as-is
				this.debug(reqPrefix, 'Make fresh throttled request');
				return this.throttles[hash] = this.request(config)
					.finally(()=> { // Resolved - remove from pending list
						delete this.throttles[hash];
					})
			}
		},


		/**
		* Try to fetch a remote resource but use a locally cached version, if it exists
		*
		* @param {String} [url] The URL to fetch
		* @param {AxiosRequest|Object} [options] AxiosRequest config or POJO to transform into one
		* @param {String} [options.url] The URL endpoint to access
		* @param {String} [options.responseType='json'] The output data type expected
		* @param {Object} [options.cache] Caching options
		* @param {String} [options.cache.cacheName='FetchCache'] The name of the cache to read/write cached data from/to
		* @param {String|Number|Date} [options.cache.expires='1d'] Either a timestring() compatible time to store the cache data, the time in milliseconds from now to store data or the Date of expiry
		* @param {Function} [options.debug] Debug output function used to display messages back to the user, by default this function does nothing
		* @param {Function} [options.hasher] Async function used to compute a valid URL to cache, by default this is the base URL + a hash of the method, params, headers and data
		*
		* @returns {Promise<Object>} An AxiosResponse-a-like object which is composed the same way as a regular AxiosResponse but with the {data} object expanded to whatever the `responseType` was specified. This response is either from the cache (if its not expired) OR from a fresh request
		*/
		lazyGet(url, options) {
			let settings = {
				responseType: 'json',
				...(
					typeof url == 'string' ? {url, ...options}
					: typeof url == 'object' ? url
					: options
				),
				cache: {
					cacheName: 'FetchCache',
					expires: '1d',
					checkExpiry: true,
					debug(...msg) {
						// console.info('[$http.lazyGet]', ...msg);
					},
					hasher(settings) {
						return (
							settings.url
							+ '?'
							+ hasher({
								...(settings.method && {method: settings.method}),
								...(settings.params && {params: settings.params}),
								...(settings.headers && {headers: settings.headers}),
								...(settings.data && {query: settings.data}),
							})
						)
					},
					...(url?.cache || options?.cache),
				},
			};

			let cacheHandle, cacheKey;
			return Promise.resolve()
				.then(()=> Promise.all([
					// Open cache + return handle
					caches.open(settings.cache.cacheName)
						.then(res => cacheHandle = res),

					// Compute hash of URL
					Promise.resolve(settings.cache.hasher(settings))
						.then(res => cacheKey = res),
				]))
				.then(()=> cacheHandle.match(cacheKey))
				.then(res =>
					!res ? null // No response
					: settings.checkExpiry && new Date(res.headers.get('Expires')) <= new Date() ? Promise.resolve() // Possible match but data has expired
						.then(()=> settings.cache.debug(cacheKey, 'Cached content has expired - deleting'))
						.then(()=> cacheHandle.delete(cacheKey))
						.then(()=> null)
					: settings.responseType == 'json' ? {...res, data: res.json()} // As JSON
					: settings.responseType == 'blob' ? {...res, data: res.blob()} // As blob
					: settings.responseType == 'text' ? {...res, data: res.text()} // As text
					: (()=> { throw new Error(`Unsupported response type "${settings.responseType}"`) })()
				)
				.then(res => {
					if (res) {
						settings.cache.debug(cacheKey, 'Use cached resource', res);
						return res;
					}

					// No cache or cache is empty - run the actual request
					settings.cache.debug(cacheKey, 'Make fresh request');
					return this.request(omit(settings, ['cache']))
						.then(newRes => cacheHandle.put(cacheKey, new Response(newRes.data, {
							headers: {
								'Content-Type': 'application/json',
								...newRes.headers,
								Expires:
									settings.cache.expires instanceof Date ? settings.cache.expires.toUTCString()
									: typeof settings.cache.expires == 'string' ? new Date(Date.now() + timestring(settings.cache.expires, 'ms')).toUTCString()
									: isFinite(settings.cache.expires) ? new Date(Date.now() + settings.cache.expires).toUTCString()
									: (()=> { throw new Error(`Unknown expires type "${settings.cache.expires}" must be a string, Date or finite number`) })()
							},
						})).then(()=> newRes)) // Eventually return the input response
				})
		},


		/**
		* Make a HTTP request but use a cached version of the resource first if its available while waiting for the request to complete
		*
		* 1. Check the local cache and call `onState(response)` if state exists there
		* 2. Make the actual HTTP request in the background
		* 3. Call `onState(response)` if EITHER:
		*    a) We didn't have a local state in 1.
		*    b) The state differs from that in 1.
		*
		* NOTE: Because state could potencially be returned twice (cache + actual HTTP response) this function does not return a Promise in the usual way
		*       Instead use the `onState(response)` callback to attach a reactive function.
		*       You can still await the Promise to know if the operation has completed.
		*
		* @param {String} [url] The URL to fetch
		* @param {AxiosRequest|Object} options AxiosRequest config or POJO to transform into one
		* @param {Boolean} [options.enabled=true] Whether to allow cache usage, if disabled this fuction acts similar to a regular `$http.request()` + `onState(response:Response)`, when disabled responses are still cached
		* @param {Function} options.onState Async callback function invoked as `(response:Response)` when state is available
		* @param {String} [options.url] The URL endpoint to access
		* @param {'first'|'last'} [options.resolveOn='first'] How to resolve the wrapping promise. ENUM: 'first' (resolve on local state if its available), 'last' (resolve only when the remote state has also been supplied)
		* @param {Function} [options.onCacheHit] Async callback function invoked as `(cacheResponse:Response)` when a cache value is present, called before `onState()`
		* @param {Function} [options.onCacheSkip] Async callback function invoked as `(cacheResponse:Response, httpResponse:Response)` when a cache value has arrived but the HTTP response has already populated anyway, called after `onState()`
		* @param {Function} [options.onHttpHit] Async callback function invoked as `(httpResponse:Response, cacheResponse?:Response)` when a HTTP value has arrived
		* @param {Function} [options.onHttpSkip] Async callback function invoked as `(httpResponse:Response, cacheResponse?:Response)` when a HTTP value has arrived but it matches the cache value so `onState()` will be skipped
		* @param {Function} [options.onDone] Async callback function invoked as `(httpResponse:Response, cacheResponse?:Response)` when both local and remote states have both been refreshed
		* @param {String} [options.responseType='json'] The output data type expected
		* @param {Object} [options.cache] Caching options
		* @param {String} [options.cache.cacheName='FetchCache'] The name of the cache to read/write cached data from/to
		* @param {String|Number|Date} [options.cache.expires='7d'] Either a timestring() compatible time to store the cache data, the time in milliseconds from now to store data or the Date of expiry
		* @param {Function} [options.debug] Debug output function used to display messages back to the user, uses `VueComponent.debug()` by default
		* @param {Function} [options.hasher] Async function used to compute a valid URL to cache, by default this is the base URL + a hash of the method, params, headers and data
		* @param {Function} [options.equalityChecker] Sync function to determine equality when comparing a cached response to the HTTP response, called as `(cached:Response, response:Response)`, defaults to `Lodash.isEqual` on the each requests `status` + `data` sub keys
		*
		* @returns {Promise<Object>} A Promise which resolves when the HTTP request completes depending on `resolveOn`. Use the `onState(response)` callback to react to incoming data. Because of how these two states can resolve async one or another of the response tuple can be nullish
		* @property {Response} [local] The locally cached response, if available
		* @property {Response} [remote] The remote "real" response, if available
		*
		* @example Fetch a slow resource - using the cache ahead of the response if we have one
		*
		* $http.preemptive({
		*   url: '/api/slow/response',
		*   onState({data}) {
		*     // React to data somehow (data can be from cache or HTTP or both)
		*   },
		* })
	    */
		preemptive(url, options) {
			let vm = this;
			let settings = { // {{{
				/* eslint-disable no-unused-vars */
				enabled: true,
				onState(res) {
					throw new Error('No function attached to $http.preemptive({onState:Function})');
				},
				resolveOn: 'first',
				onCacheHit(cacheRes) {},
				onCacheSkip(cacheRes, httpRes) {},
				onHttpHit(httpRes, cacheRes) {},
				onHttpSkip(httpRes, cacheRes) {},
				onDone(httpRes, cacheRes) {},
				responseType: 'json',
				...(
					typeof url == 'string' ? {url, ...options}
					: typeof url == 'object' ? url
					: options
				),
				cache: {
					cacheName: 'FetchCache',
					expires: '7d',
					checkExpiry: true,
					debug(...msg) {
						// vm.debug(`[$http.preemptive::${cacheKey}]`, ...msg);
						console.log(`[$http.preemptive::${cacheKey}]`, ...msg);
					},
					hasher(settings) {
						return (
							settings.url
							+ '?'
							+ hasher({
								...(settings.method && {method: settings.method}),
								...(settings.params && {params: settings.params}),
								...(settings.headers && {headers: settings.headers}),
								...(settings.data && {query: settings.data}),
							})
						)
					},
					equalityChecker(cached, response) {
						return isEqual(
							{
								status: cached?.status,
								data: cached?.data,
							},
							{
								status: response?.status,
								data: response?.data,
							},
						);
					},
					...(url?.cache || options?.cache),
				},
			}; // }}}
			const omitKeys = ['enabled', 'resolveOn', 'cache', 'onState', 'onCacheHit', 'onCacheSkip', 'onHttpHit', 'onHttpSkip', 'onDone']; // Keys to remove from the options structure when passing control to Axios
			let emittedCacheState; // The emitted cache response
			let emittedHttpState; // The emitted real HTTP response

			let cacheHandle, cacheKey;

			let preemptivePromise = Promise.withResolvers();

			// Start the main promise chain in the background (we return `preemptivePromise.promise` after this)
			Promise.resolve()
				.then(()=> Promise.all([
					// Compute hash of request {{{
					Promise.resolve()
						.then(()=> settings.cache.hasher(settings))
						.then(res => cacheKey = res),
					// }}}
					// Open or reuse the cache storage instance {{{
					Promise.resolve()
						.then(()=>
							this.caches[settings.cache.cacheName] // Reuse existing cache handle
							|| globalThis.caches.open(settings.cache.cacheName) // Open cache + return handle
								.then(res => this.caches[settings.cache.cacheName] = res) // Hold handle for reuse next time
						)
						.then(res => cacheHandle = res),
					// }}}
				]))
				.then(()=> Promise.all([
					// Check for a cached response {{{
					settings.enabled && Promise.resolve()
						.then(()=> cacheHandle.match(cacheKey)) // Fetch (possible) cached result against key
						.then(async (res) =>
							!res ? null // No response
							: settings.checkExpiry && new Date(res.headers.get('Expires')) <= new Date() ? Promise.resolve() // Possible match but data has expired
								.then(()=> settings.cache.debug('Cached content has expired - deleting'))
								.then(()=> cacheHandle.delete(cacheKey))
								.then(()=> null)
							: settings.responseType == 'json' ? {...res, data: await res.json()} // As JSON
							: settings.responseType == 'blob' ? {...res, data: await res.blob()} // As blob
							: settings.responseType == 'text' ? {...res, data: await res.text()} // As text
							: (()=> { throw new Error(`Unsupported response type "${settings.responseType}"`) })()
						)
						.then(res => {
							if (res) {
								settings.cache.debug('Use cached resource', res);
								if (emittedHttpState) { // For some reason we the HTTP state has already fired - assume this is fresher and ship `onState()`
									settings.cache.debug('Got cache state AFTER request has already returned - skipping');
									return Promise.resolve()
										.then(()=> settings.onCacheSkip(res))
								} else {
									emittedCacheState = res;
									settings.cache.debug('Got cache state', res);
									return Promise.resolve()
										.then(()=> settings.onCacheHit(res))
										.then(()=> settings.onState(res))
										.then(()=> settings.resolveOn == 'first' && preemptivePromise.resolve({
											local: emittedHttpState,
											remote: emittedCacheState,
										}))
								}
							}
						}),
					// }}}

					// Make the real HTTP request {{{
					Promise.resolve()
						.then(()=> omit(settings, omitKeys))
						.then(axiosRequest => {
							settings.cache.debug('Make fresh request', axiosRequest);
							return this.request(axiosRequest);
						})
						.then(newRes => Promise.all([
							// Stash the response in the cache {{{
							cacheHandle.put(cacheKey, new Response(
								JSON.stringify(newRes.data),
								{
									headers: {
										'Content-Type': 'application/json',
										...newRes.headers,
										Expires:
											settings.cache.expires instanceof Date ? settings.cache.expires.toUTCString()
											: typeof settings.cache.expires == 'string' ? new Date(Date.now() + timestring(settings.cache.expires, 'ms')).toUTCString()
											: isFinite(settings.cache.expires) ? new Date(Date.now() + settings.cache.expires).toUTCString()
											: (()=> { throw new Error(`Unknown expires type "${settings.cache.expires}" must be a string, Date or finite number`) })()
									},
								},
							)),
							// }}}
							// Fire the onState() callback {{{
							Promise.resolve()
								.then(()=> emittedHttpState = newRes)
								.then(()=> settings.cache.equalityChecker(emittedCacheState, emittedHttpState))
									.then(stateIsEqual => { // If state differs call `onState()` again
										if (stateIsEqual) {
											settings.cache.debug('HTTP state matches cached state - skipping');
											return Promise.resolve()
												.then(()=> settings.onHttpSkip(res, emittedCacheState))
										} else {
											settings.cache.debug('HTTP state MIS-matches cached state', emittedHttpState);
											return Promise.resolve()
												.then(()=> settings.onHttpHit(emittedHttpState, emittedCacheState))
												.then(()=> settings.onState(emittedHttpState))
												.then(()=> settings.resolveOn == 'first' && preemptivePromise.resolve({
													local: emittedHttpState,
													remote: emittedCacheState,
												}))
										}
									}),
							// }}}
						])),
					// }}}
				]))
				.then(()=> settings.onDone(emittedHttpState, emittedCacheState))
				.then(()=> settings.resolveOn == 'last' && preemptivePromise.resolve(emittedHttpState, emittedCacheState))

			return preemptivePromise.promise;
		}
	},


	/**
	* Vitel service wrapper in case this component is called as a function (e.g. `vm.$http()`)
	*/
	call(...args) {
		return this.axios.request(...args);
	},
	created() {
		// Make Axios request JSON by default
		this.axios.defaults.headers.common.Accept = 'application/json';

		// Set base config if we are given one
		if (this.config) {
			this.debug('Using config', this.config);
			merge(this.axios.defaults, this.config);
		}

		// Make Axios encode using jQueries parameter serializer to keep Monoxide happy
		/* FIXME: Not sure if this is used these days - MC 2023-09-19
		this.axios.defaults.paramsSerializer = params =>
			$.param(params)
				.replace(/\bq=(.+)\b/g, p => p.replace(/%3A/g, ':')) // Allow `q=` to contain ':' tags
		*/

		// Add request debugging if enabled
		this.debug(()=> {
			this.axios.interceptors.request.use(
				config => {
					this.debug('Request', config);
				},
				error => {
					this.debug('Request error', error);
				},
			)
		});


		// Monkey patch Axios so that any error response gets correctly decoded rather than weird stuff like 'Server returned a 403 code'
		this.axios.interceptors.response.use(
			response => response,
			error => {
				if (!error.response || !error.response.status) {
					return Promise.reject(error);
				} else if (this.rewriteTextErrors && error.config?.method && error.config?.url && error.response?.status && error.request?.responseText) { // Do we have enough of an error object to construct a nicer response?
					return Promise.reject(`${error.config.method.toUpperCase()} ${error.config.url} returned ${error.response.status} - ${error.request.responseText}`);
				} else if (this.rewritePayloadErrors && error.config?.method && error.config?.url && error.response?.status && error.response?.data?.error) {
					return Promise.reject(`${error.config.method.toUpperCase()} ${error.config.url} returned ${error.response.status} payload error - ${error.response.data.error}`);
				} else if (error.response && error.response.data) {
					return Promise.reject(error.response.data);
				} else {
					return Promise.reject(error.response);
				}
			},
		);
	},
}
</script>
