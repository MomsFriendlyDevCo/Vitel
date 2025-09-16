<script>
import {sortBy} from 'lodash-es';

/**
* Simple timeline display of items
*
* @slot icon Overriding icon template. Bound with `:item`
* @slot body Overriding body template - this wraps title + content + date. Bound with `:item`
* @slot title Overriding title template. Bound with `:item`
* @slot content Overriding content template. Bound with `:item`
* @slot date Overriding date template. Bound with `:item`
*/
export default {
	data() { return {
		/**
		* How to position the timeline sideline
		* This is updated by `repositionSideline()` + a resizeObserver
		*
		* @type {Object?}
		* @property {Number} top The top offset
		* @property {Number} bottom The top offset
		*/
		sidelinePosition: null,

		/**
		* Subscribed resize handler when monitorig size + position
		* @type {ResizeObserver}
		*/
		resizeObserver: null
	}},
	props: {
		/**
		* Input timeline items to process
		*
		* @typedef {Object} TimelineItem
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
	methods: {
		repositionSideline() {
			if (!this.$el) return; // Mount not ready yet
			console.log('Timeline reposition!');
			let icons = [...(this.$el.querySelectorAll('.timeline-item-icon') ?? [])];

			this.sidelinePosition = icons && icons.length > 1 && {
				top: Math.ceil(icons.at(0).offsetTop + (icons.at(0).offsetHeight / 2)),
				height: Math.ceil(icons.at(-1).offsetTop - (icons.at(0).offsetHeight / 2) + (icons.at(-1).offsetHeight / 2)),
				left: Math.ceil(icons.at(0).offsetLeft + (icons.at(0).offsetWidth / 2)),
			};
		},
	},
	mounted() {
		this.resizeObserver = new ResizeObserver(this.repositionSideline);
		this.resizeObserver.observe(this.$el);

		this.repositionSideline(); // Kickoff initial positioning
	},
	beforeUnmount() {
		if (this.resizeObserver) this.resizeObserver.disconnect();
	},
}
</script>

<template>
	<div class="timeline">
		<div
			v-if="sidelinePosition"
			class="timeline-sideline"
			:style="{
				'--timeline-sideline-left': `${sidelinePosition.left}px`,
				'--timeline-sideline-top': `${sidelinePosition.top}px`,
				'--timeline-sideline-height': `${sidelinePosition.height}px`,
			}"
		/>
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
				<slot name="body" :item>
					<div v-if="item.title" class="timeline-item-title">
						<slot name="title">
							{{item.title}}
						</slot>
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
				</slot>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
:root {
	--timeline-sideline-color: var(--bs-secondary);
	--timeline-sideline-width: 4px;
	--timeline-item-padding: 10px;
}

.timeline {
	width: 100%;
	position: relative; /* Use as the wrapper for .timeline-sideline */

	& .timeline-sideline {
		position: absolute;
		background: var(--timeline-sideline-color);
		top: var(--timeline-sideline-top);
		height: var(--timeline-sideline-height);
		left: calc(var(--timeline-sideline-left) - (var(--timeline-sideline-width) / 2));
		width: var(--timeline-sideline-width);
		z-index: 0;
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

				& i {
					padding: 0;
				}
			}
		}

		& .timeline-item-col-body {
			display: flex;
			flex-direction: column;
			padding-top: 4px;

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
