<script>
import {sortBy} from 'lodash-es';

/**
* Simple timeline display of items
*/
export default {
	props: {
		/**
		* Input timeline items to process
		*
		* @typedef {TimelineItem}
		* @type {Object}
		* @property {String} id The unique identifier of the timeline item
		* @property {Date|String} date The timestamp on each timeline item
		* @property {String} [content] Optional content to display, if omitted a blank content area is displayed (unless overriden via `defaults.content`)
		* @property {String} [icon] Icon to display for the timeline item, overriden by `defaults.icon` if specified there
		* @property {String} [iconOuter] Outer icon stack to display
		* @property {String} [href] Optional v-href link or link object to apply to the timeline item
		*/
		items: {type: Array, validator: v => v.every(i => i.id && i.date)},


		/**
		* Indicates that the input items are already sorted in the current order
		* If truthy, sorting (+ `$props.reverse`), is ignored and items are used as-is
		*
		* @type {Boolean}
		*/
		sorted: {type: Boolean, default: false},


		/**
		* Reverse the list so that the most recent items appear at the top of the timeline
		*
		* @type {Boolean}
		*/
		reverse: {type: Boolean, default: false},


		/**
		* Default timeline prototype to assume in all cases
		*
		* @type {TimelineItem}
		*/
		defaults: {type: Object, default: ()=> ({
			icon: 'far fa-dot',
			iconOuter: '', // 'fas fa-circle',
			content: '',
		})},
	},
	computed: {

		/**
		* Refactor the incoming log items into a sorted, filtered array we then display
		* @returns {Array<Object>} An array of timeline items
		*/
		computedTimeline() {
			let items = this.items.map(item => ({  // Shallow copy original and check items
				id: item.id || (()=> { throw new Error('ID must be specified for timeline item') })(),
				date: (()=> {
					if (item.date && typeof item.date == 'string') {
						return new Date(item.date);
					} else if (item.date && item.date instanceof Date) {
						return item.date;
					} else {
					   	throw new Error('Date must be specified or a ISO8901 format for timeline item');
					}
				})(),
				icon: item.icon || this.defaults.icon,
				iconOuter: item.iconOuter || this.defaults.iconOuter,
				content: item.content || this.defaults.content,
				href: item.href,
			}));

			// Sort
			if (!this.sorted) items = sortBy(items, 'date');

			// Optionally reverse the list
			if (this.reverse) items.reverse();

			return items;
		},

	},
}
</script>

<template>
	<div class="timeline">
		<div
			v-for="item in computedTimeline"
			:key="item.id"
			class="timeline-item"
			v-href="item.href"
		>
			<div class="timeline-item-date">
				<slot name="date" :item>
					{{item.date.toLocaleString()}}
				</slot>
			</div>
			<div class="timeline-item-icon">
				<slot name="icon" :item>
					<div v-if="item.iconOuter" class="fa-stack">
						<i class="fa-stack-1x" :class="item.iconOuter"/>
						<i class="fa-stack-1x" :class="item.icon"/>
					</div>
					<i
						v-else-if="item.icon"
						:class="item.icon"
					/>
				</slot>
			</div>
			<div class="timeline-item-content">
				<slot name="content" :item>
					{{item.content}}
				</slot>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.timeline {
	--timeline-line-color: var(--bs-light);
	--timeline-line-width: 2px;

	width: 100%;

	& .timeline-item {
		display: flex;
		flex-direction: columns;

		width: 100%;

		& .timeline-item-date {
			width: 150px;
			font-size: small;
			text-align: right;
		}

		& .timeline-item-icon {
			width: 30px;
			text-align: center;

			/*
			margin-left: 10px;
			text-align: left;

			&::before {
				z-index: 2;
			}

			::after {
				content: '';
				background: var(--timeline-line-color);
				top: 0px;
				bottom: 0px;
				left: calc(50% - (var(--timeline-line-width) / 2));
				width: var(--timeline-line-width);
				position: absolute;
				z-index: 1;
			}

			& i {
				position: absolute;
				top: 2px;
				left: 0px;
				z-index: 2;
			}
			*/

			& i {
				padding: 0;
			}
		}

		& .timeline-item-content {
			text-align: left;
		}
	}
}
</style>
