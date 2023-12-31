<script>
import {Position} from './scrollytelling.utils.js';

/**
* Sub-item of a <scrollytelling/> component
*
* @provides {VueComponent} stItem This <scrollytelling-item/> component
* @injects {VueComponent} st The parent <scrollytelling/> component
*
* @property {String} [position='screen'] How to position the item
* @property {Boolean} [follow=false] Follow the scroll down the page - usually true for videos or other context that needs to stay in the center of the screen
*/
export default {
	inject: ['st'],
	provide() { return {
		stItem: this,
	}},
	data() { return {
		/**
		* Position within this scrollytelling-item
		*
		* @type {Position}
		* @property {Float} float Position within the item expressed as a float percentage (0 to 1)
		* @property {Number} percent Position within the item expressed as a natural percentage (0 - 100)
		* @property {Number} absolute The raw absolute offset (usually pixels)
		* @property {Number} max Maxmimum absolute value
		*/
		innerPosition: null,


		/**
		* Number of life units this component is expected to hang around
		* Calculated automatically by <scrollytelling-video/> etc.
		* Use setLifetime() to populate
		* @type {Number} Time in ticks (usually milliseconds)
		*/
		lifetime: 0,
	}},
	props: {
		position: {
			type: String,
			validate: v => [
				'screen',
				'screen-snap',
				'inline',
			].includes(v),
			default: 'screen',
		},

		follow: {
			type: Boolean,
			default: true,
		},
	},
	methods: {
		/**
		* Set the lifetime of a component based on some dynamic criteria like the video length
		* @param {Number} lifetime Lifetime in milliseconds to allow this component to live
		*/
		setLifetime(lifetime) {
			this.lifetime = lifetime;
		},
	},
	mounted() {
		this.st.register(this); // Register this child with parent
		this.$el.$vueComponent = this; // Create handle we can use to lookup the VueComponent from the DOM element - used by parent to address child items on scroll
	},
}
</script>

<template>
	<div
		class="scrollytelling-item"
		:class="[
			`position-${position}`,
			follow && 'follow',
		]"
	>
		<div class="content">
			<slot/>
		</div>

		<div
			v-if="lifetime > 0"
			class="lifetime-padding"
			:style="`height: ${lifetime}px`"
		/>
	</div>
</template>

<style lang="scss">
.scrollytelling .scrollytelling-item {
	pointer-events: none;
	flex-wrap: wrap;

	& .content {
		width: 100%;
		height: 100%;
	}

	/* Positions: .position-* {{{ */
	&.position-screen, &.position-screen-snap {
		display: flex;
		width: 100%;
		min-height: 100%;
	}

	&.position-screen-snap {
		scroll-snap-align: end;
	}
	/* }}} */

	/* Lock content area to top of view if we're focused + inside an innerPosition scroll {{{ */
	&.focused .content {
		/*
		position: fixed;
		top: 0px;
		*/
	}
	/* }}} */

	/* Follow content: .follow {{{ */
	&.follow .content {
		position: sticky;
		top: 1px;
	}
	/* }}} */

	/* .lifetime-padding {{{ */
	& .lifetime-padding {
		flex-basis: 100%;
		background: transparent;
	}
	/* }}} */
}
</style>
