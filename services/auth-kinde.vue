<script>
import createKindeClient from '@kinde-oss/kinde-auth-pkce-js';

/**
* Global $authKinde service
* Available on all Vue models as `vm.$auth`
*/
export default {
	name: '$authKinde',
	data() { return {
		/**
		* Kinde instance used to track the user state
		*/
		kinde: null,


		/**
		* Current auth state
		* ENUM: 'loading', 'guest', 'user'
		* @type {String}
		*/
		state: 'loading',


		/**
		* Indicates the loading state of the $authKinde module
		* This only indicates if the state has settled, NOT if the user is logged in
		* @type {Boolean}
		*/
		ready: false,


		/**
		* Indicates the if the current user is valid and is logged in
		* @type {Boolean}
		*/
		isLoggedIn: false,


		/**
		* The currently logged in user data (if any)
		* @type {Object|null}
		*/
		user: null,
	}},
	props: {
		/**
		* Non-secret Kinde client ID to use
		* @type {String}
		*/
		clientId: {type: String, required: true},


		/**
		* Authentication domain to register with
		* @type {String}
		*/
		domain: {type: String, required: true},


		/**
		* If set, bypass Kinde auth and assume this as the logged in email addres
		* @type {String}
		*/
		bypassEmail: {type: String, requried: true},


		/**
		* If `bypassEmail` is set assume this as the user ID
		* @type {String}
		*/
		bypassId: {type: String, default: '00000000-0000-dead-beef-000000000000'},
	},
	methods: {
		/**
		* Reloads local state from this.$authKinde
		* This is an internal function to be called whenever Kinde messages that its state has changed
		* @fires $kinde:change When the current user changes in any way
		* @param {Object} [newState] The incoming new user state
		* @returns {Promise} A promise which resolves when the operation has completed
		*/
		refresh(newState) {
			if (this.bypassEmail) { // Bypass Kinde on dev instances
				this.isLoggedIn = true;
				this.state = 'user';
				this.user = {
					id: this.bypassId, // UUID-a-like for basic auth trickery
					email: this.bypassEmail,
				};
				this.debug('Auth change', this.user, '(bypassed email)');
				this.$events.emit('$kinde:change');
			} else if (newState) {
				this.isLoggedIn = true;
				this.state = 'user';
				this.user = newState;
				this.debug('Auth change', this.user);
				this.$events.emit('$kinde:change', this.user);
			} else {
				this.isLoggedIn = false;
				this.state = 'guest';
				this.user = null;
				this.debug('Auth change to null');
				this.$events.emit('$kinde:change');
			}
		},


		/**
		* Try and register the user
		*/
		login() {
			return this.promise()
				.then(()=>  this.kinde.login());
		},


		/**
		* Try and register a new user
		*/
		signup() {
			return this.promise()
				.then(()=> this.kinde.register());
		},


		/**
		* Try and logout of the current session
		* @returns {Promise} A promise which resolves when the operation has completed
		*/
		logout() {
			return this.promise()
				.then(()=> this.kinde.logout());
		},


		/**
		* Utility function to be used in the VueComponent.created() lifecycle hook which checks the user is logged in
		* @param {Object} [options] Additional options to mutate behaviour
		* @param {Boolean} [options.silent=false] Disable all other options and just redirect
		* @param {String} [options.notify='You need to be logged in to do that'] Message to show if the user is not logged in
		* @param {String} [options.throw='User is not logged in'] Contents of thrown Error on fail, set to falsy to skip
		* @param {String} [options.redirect='/'] Path to redirect to on fail, set to falsy to skip
		*/
		requireLogin(options) {
			let settings = {
				silent: false,
				notify: 'You need to be logged in to do that',
				throw: 'User is not logged in',
				redirect: '/login',
				...options,
			};

			return this.promise()
				.then(()=> this.isLoggedIn || Promise.reject('NOLOGIN'))
				.catch(e => {
					if (e === 'NOLOGIN') {
						if (!settings.silent && settings.notify) this.$toast.create(settings.toast);
						if (settings.redirect) this.$router.push(settings.redirect);
						if (!settings.silent && settings.throw) throw new Error(settings.throw);
					}
				})
		},
	},
	created() {
		return this.$services.require('$events')
			.then(()=> {
				if (this.bypassEmail) {
					// Bypass Login - this should only occur on local dev instances
					this.debug('Bypassing auth with email', this.bypassEmail);
					return this.refresh();
				} else {

					return createKindeClient({ // Create Kinde handler
						client_id: this.clientId,
						domain: this.domain,
						redirect_uri: window.location.origin,
						on_redirect_callback: this.refresh,
						...(import.meta.env.DEV && {
							is_dangerously_use_local_storage: true,
						}),
					})
						.then(instance => this.kinde = instance)
						.then(()=> this.kinde.getUserProfile() // Fetch user (if there is one)
							.catch(e => {
								if (e?.status == 403) {
									return null;
								} else {
									throw e;
								}
							})
						)
						.then(state => this.refresh(state))
						.catch(this.$toast.catch)
				}
			})
	},
}
</script>