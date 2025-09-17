<script>
/**
* Vue component to show a linear status progression from left to right
*
* @example Simple task flow
* <status-progression
*   v-model="task.status"
*   :states="[
*     {id: 'draft', title: 'Draft'},
*     {id: 'pending', title: 'Pending'},
*     {id: 'active', title: 'Active'},
*     {id: 'complete', title: 'Complete'},
*     {id: 'error', title: 'Error', show: false},
*   ]"
* >
*/

/**
* A single progression state
*
* @typedef {Object} ProgressionState
* @property {String} id The unique ID of the state
* @property {String} title The short human-readable title of the state
* @property {String} class Additional CSS classes to apply to the element in all states
* @property {String} [icon] Optional Icon to display for the state
* @property {String|Object} [tooltip] Optional tooltip spec (Vue-Tooltip or some varient of it must be active)
* @property {String|Object} [href] Optional v-href spec (v-href must be active)
* @property {Boolean} [show] Whether to show the state, if the value is set to this it will be shown anyway (e.g. 'deleted')
*/
export default {
	props: {

		/**
		* The currently selected state, if any
		*
		* @type {String}
		*/
		modelValue: {type: String},


		/**
		* The list of states to use
		*
		* @type {Array<ProgressionState>}
		*/
		states: {type: Array, validate: v => v.every(i => i.id && i.title), default: ()=> [
			{id: 'foo', title: 'Foo', icon: 'far fa-pencil'},
			{id: 'bar', title: 'Bar', icon: 'far fa-circle'},
			{id: 'baz', title: 'Baz', icon: 'far fa-circle-dot'},
			{id: 'quz', title: 'Quz', icon: 'fas fa-circle'},
			{id: 'flarp', title: 'Flarp', icon: 'fas fa-circle-check'},
		]},
	},
	computed: {

		/**
		* Filtered version of `$props.states` where hidden items are removed unless they are the active value
		*
		* @returns {Array<ProgressionState>} Filtered list of `$props.states`
		*/
		computedStates() {
			// Find the current offset of the state so we can allocate the class list correctly
			let stateOffset = this.modelValue ? this.states.findIndex(s => s.id == this.modelValue) : -1;

			return this.states
				.map((s, i) => ({
					...s,
					class:
						s.id == this.modelValue ? 'active'
						: stateOffset > -1 && i < stateOffset ? 'prev'
						: stateOffset > -1 && i > stateOffset ? 'next'
						: 'inactive'
				}))
				.filter(s => (s.show ?? true) || s.id == this.modelValue)
		},

	},
}
</script>

<template>
	<div class="progression">
		<div
			v-for="state in computedStates"
			:key="state.id"
			class="progression-item"
			:class="[
				`progression-item-state-${state.class}`,
				state.class,
			]"
			v-tooltip="state.tooltip"
			v-href="state.href"
		>
			<i v-if="state.icon" class="progression-item-icon" :class="state.icon"/>
			<div class="progression-item-title">
				{{state.title}}
			</div>
		</div>
	</div>
</template>

<style lang="scss">
:root {
	--progression-item-height: 30px;
	--progression-item-width: 150px;
	--progression-item-rounding: 20px;
	--progression-item-spacing: -12px;
}

.progression {
	display: flex;
	align-items: center;
	justify-content: start;
	padding-left: 12px;
	user-select: none;

	& .progression-item {
		display: flex;
		align-items: center;
		justify-content: start;
		height: var(--progression-item-height);
		width: var(--progression-item-width);

		padding: 20px 22px;
		margin: 0 var(--progression-item-spacing);
		clip-path: polygon(
			80% 0%,
			90% 50%,
			80% 100%,
			0% 100%,
			10% 50%,
			0% 0%
		);
		color: var(--bs-white);

		&:first-child {
			clip-path: polygon(
				80% 0%,
				90% 50%,
				80% 100%,
				0% 100%,
				0% 50%,
				0% 0%
			);
			border-top-left-radius: var(--progression-item-rounding);
			border-bottom-left-radius: var(--progression-item-rounding);
		}

		&:last-child {
			clip-path: polygon(
				100% 0%,
				100% 50%,
				100% 100%,
				0% 100%,
				10% 50%,
				0% 0%
			);
			border-top-right-radius: var(--progression-item-rounding);
			border-bottom-right-radius: var(--progression-item-rounding);
		}

		/* States {{{ */
		&.progression-item-state-prev {
			background: var(--bs-success);
		}
		&.progression-item-state-active {
			background: var(--bs-primary);
		}
		&.progression-item-state-inactive, &.progression-item-state-next {
			background: var(--bs-secondary);
		}
		/* }}} */

		.progression-item-icon {
			margin-right: 8px;
		}

		.progression-item-title {
		}
	}
}
</style>
