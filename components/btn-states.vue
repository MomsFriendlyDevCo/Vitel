<script>
/**
* A button which acts as a state toggler or dropdown
*
* Requires:
*            - Bootstrap (for Dropdowns)
*            - v-tooltip directive
*
* @emits change Emitted as `(value:*)` with the current state value when the state changes (the value of the `activeState.value`)
*/
export default {
	emits: ['change'],
	data() { return {
		/**
		* The current state index
		*
		* @type {Number}
		*/
		state: 0,
	}},
	props: {

		/**
		* Initial value of the button
		* Will match to the fist $props.states[].value
		* @type {*}
		*/
		value: null,


		/**
		* Method to allow the user to change state
		*
		* @type {'advance'|'dropdown'}
		*/
		method: {type: String, default: 'advance', validator: v => ['dropdown', 'advance'].includes(v)},


		/**
		* Base state template - overriden by each state, also used when no state is selected
		*
		* @see states
		* @type {Object}
		*/
		defaults: {type: Object, default: ()=> ({
			value: null,
		})},


		/**
		* State definition overrides
		*
		* @type {Array<Object>}
		* @property {String} [class] Optional button classes to apply when in this state
		* @property {String} [icon] Optional icon to display when in this state
		* @property {String} [text] Optional text to display when in this state
		* @property {*} [value] Value to emit when changing to this state
		* @property {String|Object} [tooltip] Optional tooltip string / object to bind
		* @property {Boolean} [show=true] Whether to allow this item to be selectable, will be bypassed in `$props.method=='advance'`, wont show up as selectable in `$props.method=='dropdown'`
		*/
		states: {type: Array, default: ()=> [
			{
				class: 'btn-primary',
				icon: 'far fa-circle',
				text: 'Off',
				value: false,
			},
			{
				class: 'btn-primary',
				icon: 'far fa-circle-check',
				text: 'On',
				value: true,
			},
		]},


		/**
		* Maximum number of avances to allow when trying to find a selectable state
		* If a state has `{show:false}` and `$props.method=='advance'` this is the maximum number of advance steps to find a state before giving up
		*
		* @type {Number}
		*/
		advanceSeekMax: {type: Number, default: 3},
	},
	computed: {
		/**
		* Returns the currently active state from $props.states
		* @returns {Object}
		*/
		activeState() {
			return {
				...this.defaults,
				...this.states[this.state],
			};
		},
	},
	methods: {
		/**
		* Advance to the next state
		*/
		advance() {
			if (++this.state >= this.states.length) this.state = 0;

			// Seek forward until we don't hit `{state.show:false}`
			for (let tries = 0; tries++; tries < this.advanceSeekMax) {
				if (!this.states[this.state].show) {
					this.state++;
				} else {
					break;
				}
			}
			if (!this.states[this.state].show) throw new Error(`<btn-states/> Cannot find a state with {show:true} after ${this.advanceSeekMax} tries`);

			this.$emit('change', this.states[this.state].value ?? this.defaults.value);
		},


		/**
		* Forcibly change the state
		* This method can be called by parents (using `$ref`) or be triggered when selecting a dropdown item
		*
		* @param {Object|*} value Either the state to select or (if not a POJO) the new value to use (searches `states` to find the active state)
		*/
		select(value) {
			let newStateIndex = this.states.findIndex(s => s === value || s.value === value);
			if (!newStateIndex) throw new Error('<btn-states/>.select() trying to set to an unknown state');
			this.state = newStateIndex;
			this.$emit('change', this.activeState.value);
			this.closeDropdown();
		},


		/**
		* Forcibly close the dropdown
		* This is used by `select()` automatically to close when clicking
		*/
		closeDropdown() {
			this.$el.querySelector('.dropdown-menu').classList.remove('show');
		},
	},
	watch: {
		value: {
			immediate: true,
			handler(v) {
				let vState = this.states.findIndex(s => s.value === v);
				if (vState < 0) {
					this.state = 0;

					if (this.value !== undefined)
						console.error('<btn-states :value=', this.value, '/> - given a value which does not correspond to any state value - assuming first state instead');
				} else {
					this.state = vState;
				}
			},
		},
	},
}
</script>

<template>
	<div class="btn-states">
		<a
			v-if="method == 'advance'"
			:class="activeState.class"
			@click="advance()"
			v-tooltip="activeState.tooltip"
		>
			<i
				v-if="activeState.icon || fallback.icon"
				:class="activeState.icon || fallback.icon"
			/>
			{{activeState.text || ''}}
		</a>
		<div v-else class="dropdown">
			<a
				:class="activeState.class"
				data-bs-toggle="dropdown"
				v-tooltip="activeState.tooltip"
			>
				<i
					v-if="activeState.icon"
					:class="activeState.icon"
				/>
				{{activeState.text || ''}}
				<i class="fas fa-caret-down"/>
			</a>
			<div class="dropdown-menu">
				<a
					v-for="choice in states.filter(s => (s.show ?? true))"
					:key="choice"
					class="dropdown-item"
					:class="choice == states[state] && 'active'"
					@click="select(choice)"
					tooltip.right="choice.tooltip"
				>
					<i
						v-if="choice.icon"
						:class="choice.icon"
						class="fa-fw"
					/>
					{{choice.text || ''}}
				</a>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.btn-states {
	user-select: none; /* Prevent browser trying to select text when rapid toggling with double clicks */

	& .dropdown {
		& .fas.fa-caret-down {
			margin-left: 10px;
		}
	}
}
</style>
