<script>
import TableOfContentsDisplay from './table-of-contents-display.vue';

/**
* Wrapper for <table-of-contents-display/> which shows a floating ToC bar to the left of the screen area
*
* By default the single exposed slot shows the <table-of-contents-display/> area but can be overridden if needed.
*
* @slot default The main display content - defaults to a <table-of-contents-display/> widget
*/
export default {
	inject: ['toc'], // Require a parent TOC(<table-of-contents>) parent
	components: {
		TableOfContentsDisplay,
	},
	data() { return {
		isOpen: false,
	}},
	props: {

		/**
		* Automatically close the floating display when clicking on a link
		* @type {Boolean}
		*/
		autoClose: {type: Boolean, default: true},
	},
	methods: {

		/**
		* Toggle the state of the floating component
		*/
		toggle() {
			this.isOpen = ! this.isOpen;
		},


		/**
		* Close the component if its open
		* This method is mainly intended to be used by $ref calls
		*/
		close() {
			this.isOpen = false;
		},


		/**
		* Open the component if it is closed
		* This method is mainly intended to be used by $ref calls
		*/
		open() {
			this.isOpen = true;
		},
	},
	mounted() {
		// Bind to <table-of-contents-area> and trigger a close if we are autoClosing
		this.toc.$el.addEventListener('selectSection', ()=> this.autoClose && this.close());
	},
}
</script>

<template>
	<div class="table-of-contents-floating" :class="isOpen && 'open'">
		<div class="table-of-contents-floating-popout">
			<div class="table-of-contents-floating-display">
				<div class="table-of-contents-floating-display-scrollable">
					<slot name="default">
						<table-of-contents-display/>
					</slot>
				</div>
			</div>
			<a @click="toggle" class="table-of-contents-floating-handle">
				<i class="far fa-2x fa-grip-dots-vertical ms-1 me-0"/>
			</a>
		</div>
	</div>
</template>

<style lang="scss">
.table-of-contents-floating {
	--toc-display-width: 300px;
	--toc-display-height: 500px;
	--toc-handle-width: 30px;
	--toc-handle-height: 100px;
	--toc-bg: var(--bs-light);
	--toc-border: 1px solid #000;
	--toc-zindex: 100;

	position: fixed;
	top: 0px;
	bottom: 0px;
	left: 0px;
	z-index: var(--toc-zindex);

	display: flex;
	justify-contnet: center;
	align-items: center;

	transition: left 0.2s ease-out;

	&.open {
	}

	&:not(.open) {
		left: calc(0px - var(--toc-display-width));
		& .table-of-contents-floating-handle {
			opacity: 0.4;
			scale: 0.8;
		}
	}

	.table-of-contents-floating-popout {
		display: flex;
		flex-direction: rows;
		align-items: center;

		z-index: var(--toc-zindex);

		white-space: nowrap;

		& .table-of-contents-floating-display {
			background: var(--toc-bg);
			border: var(--toc-border);
			border-left: 0;
			border-top-right-radius: 20px;
			border-bottom-right-radius: 20px;

			width: var(--toc-display-width);
			height: var(--toc-display-height);
			padding: 8px 0 8px 5px;

			& .table-of-contents-floating-display-scrollable {
				overflow: hidden auto;
				width: 100%;
				height: 100%;

				/* Fix scroll bead being under the scroll handle */
				position: relative;
				z-index: calc(var(--toc-zindex) + 1);
			}
		}

		& .table-of-contents-floating-handle {
			display: flex;
			justify-contnet: center;
			align-items: center;

			transition: opacity 0.2s ease-out, scale 0.2s ease-out;

			height: var(--toc-handle-height);
			width: var(--toc-handle-width);

			cursor: pointer;

			background: var(--toc-bg);
			border: var(--toc-border);
			border-left: 0;
			border-top-right-radius: 20px;
			border-bottom-right-radius: 20px;

			&:hover {
				border: 1px solid var(--bs-primary);
				border-left: 0;
				opacity: 1;
				scale: 1;
			}
		}
	}

}
</style>
