<script>
import {range} from 'lodash-es';

/**
* Simple pagination controls
* @param {number} [value=1] The current page number (between min + max)
* @param {number} [min=1] Minimum page number
* @param {number} [max=100] Maximum page number
* @param {number} [viewBehind=3] How many pages backwards to display
* @param {number} [viewForeward=3] How many pages forwards to display
* @param {boolean} [viewFirst=true] Display a 'scroll to first' button
* @param {boolean} [viewPrevious=true] Display a 'scroll to previous' button
* @param {boolean} [viewNext=true] Display a 'scroll to next' button
* @param {boolean} [viewLast=true] Display a 'scroll to last' button
*
* @emits change Emitted as `(newPageOffset)` when the page number changes
*/
export default {
	emits: ['change'],
	props: {
		value: {type: Number, default: 1},
		min: {type: Number, default: 1},
		max: {type: Number, default: 100},
		viewBehind: {type: Number, default: 3},
		viewForward: {type: Number, default: 3},
		viewFirst: {type: Boolean, default: true},
		viewPrevious: {type: Boolean, default: true},
		viewNext: {type: Boolean, default: true},
		viewLast: {type: Boolean, default: true},
	},
	computed: {
		pagesBefore() {
			return range(Math.max(this.min, this.value - this.viewBehind), this.value);
		},
		pagesAfter() {
			if (this.value == this.max) return [];
			return range(Math.min(this.value + 1, this.max + 1), Math.min(this.max + 1, this.value + this.viewForward + 1));
		},
	},
	methods: {
		set(v) {
			if (v == 'first') return this.$emit('change', this.min);
			if (v == 'previous' && this.value - 1 >= this.min) return this.$emit('change', this.value - 1);
			if (v == 'next' && this.value + 1 <= this.max) return this.$emit('change', this.value + 1);
			if (v == 'last') return this.$emit('change', this.max);
			if (typeof v == 'number') return this.$emit('change', v);
		},
	},
}
</script>

<template>
	<nav>
		<ul class="pagination">
			<li
				v-if="viewFirst"
				class="page-item"
				:class="value <= min && 'disabled'"
			>
				<a @click="set('first')" class="page-link">
					<i class="fas fa-angles-left"/>
				</a>
			</li>
			<li
				v-if="viewPrevious"
				class="page-item"
				:class="value <= min && 'disabled'"
			>
				<a @click="set('previous')" class="page-link">
					<i class="fas fa-arrow-left"/>
				</a>
			</li>
			<li
				v-for="page in pagesBefore"
				:key="page"
				class="page-item"
			>
				<a @click="set(page)" v-text="page" class="page-link"/>
			</li>
			<li
				class="page-item active"
			>
				<a @click="set(value)" v-text="value" class="page-link"/>
			</li>
			<li
				v-for="page in pagesAfter"
				:key="page"
				class="page-item"
			>
				<a @click="set(page)" v-text="page" class="page-link"/>
			</li>
			<li
				v-if="viewNext"
				class="page-item"
				:class="value >= max && 'disabled'"
			>
				<a @click="set('next')" class="page-link">
					<i class="fas fa-arrow-right"/>
				</a>
			</li>
			<li
				v-if="viewLast"
				class="page-item"
				:class="value >= max && 'disabled'"
			>
				<a @click="set('last')" class="page-link">
					<i class="fas fa-angles-right"/>
				</a>
			</li>
		</ul>
	</nav>
</template>
