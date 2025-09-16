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
		* @property {Boolean} [showDate=true] Whether to display this items date
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
			showDate: true,
			icon: 'far fa-dot',
			iconOuter: 'fas fa-circle fa-2x',
			title: '',
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
				showDate: item.showDate ?? this.defaults.showDate,
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
				title: item.title || this.defaults.content,
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
		<div class="timeline-sideline"/>
		<div class="timeline-sideline-knob-top"/>
		<div class="timeline-sideline-knob-bottom"/>
		<div
			v-for="item in computedTimeline"
			:key="item.id"
			class="timeline-item"
			v-href="item.href"
		>
			<div class="timeline-item-col-icon">
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
			</div>
			<div class="timeline-item-col-body">
				<div v-if="item.title" class="timeline-item-title">
					{{item.title}}
				</div>
				<div v-if="item.content" class="timeline-item-content">
					<slot name="content" :item>
						{{item.content}}
					</slot>
				</div>
				<div v-if="item.date && item.showDate" class="timeline-item-date">
					<slot name="date" :item>
						{{item.date.toLocaleString()}}
					</slot>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
:root {
	--timeline-line-color: var(--bs-secondary);
	--timeline-line-width: 4px;
	--timeline-line-top: 10px;
	--timeline-line-bottom: 10px;
	--timeline-line-left: 28px;

	--timeline-line-knob-top-size: 12px;
	--timeline-line-knob-top-color: var(--bs-secondary);
	--timeline-line-knob-bottom-size: 12px;
	--timeline-line-knob-bottom-color: var(--bs-secondary);

	--timeline-item-padding: 10px;
	--timeline-item-icon-width: 30px;
}

.timeline {
	width: 100%;
	position: relative; /* Use as the wrapper for .timeline-sideline */

	& .timeline-sideline {
		position: absolute;
		background: var(--timeline-line-color);
		top: var(--timeline-line-top);
		bottom: var(--timeline-line-bottom);
		left: var(--timeline-line-left);
		width: var(--timeline-line-width);
		z-index: 0;
	}

	& .timeline-sideline-knob-top {
		position: absolute;
		left: calc(var(--timeline-line-left) - (var(--timeline-line-knob-top-size) / 4));
		top: var(--timeline-line-top);
		height: var(--timeline-line-knob-top-size);
		width: var(--timeline-line-knob-top-size);
		background: var(--timeline-line-knob-top-color);
		border-radius: 50%;
	}

	& .timeline-sideline-knob-bottom {
		position: absolute;
		left: calc(var(--timeline-line-left) - (var(--timeline-line-knob-top-size) / 4));
		bottom: var(--timeline-line-bottom);
		height: var(--timeline-line-knob-bottom-size);
		width: var(--timeline-line-knob-bottom-size);
		background: var(--timeline-line-knob-bottom-color);
		border-radius: 50%;
	}


	& .timeline-item {
		display: flex;
		flex-direction: columns;
		width: 100%;

		& + .timeline-item {
			margin-top: var(--timeline-item-padding);
		}

		& .timeline-item-col-icon {
			& .timeline-item-icon {
				text-align: center;
				margin: 0 20px 0 10px;
				width: var(--timeline-item-icon-width);

				& i {
					padding: 0;
				}
			}
		}

		& .timeline-item-col-body {
			display: flex;
			flex-direction: column;

			& .timeline-item-title {
				font-weight: bold;
				color: var(--bs-primary);
			}

			& .timeline-item-content {
			}

			& .timeline-item-date {
				font-size: small;
				font-weight: lighter;
			}
		}
	}
}
</style>
