<script>
/**
* Component which wraps a page in order to compute and display a table of contents
* This should enclose the whole page area where any <table-of-contents-display/> or <table-of-contents-section/> will appear
*
* @emits newSection Emitted as `(newSection:tocSectionsItem)` whenever a new section is addded
* @emits selectSection Emitted as `(section:tocSectionsItem)` whenever a selection is selected and scrolled to, this event is also emitted as a native browser event via $el.dispatchEvent()
*/
export default {
	emits: [
		'newSection',
		'selectSection',
	],
	provide() { return {
		toc: this,
	}},
	data() { return {

		/**
		* Table-Of-Content sections we know about
		*
		* @type {Array<Object>}
		* @property {VueComponent} component The associated VueComponent
		* @property {String} title The display text to use for the section, can be HTML
		* @property {Boolean} [show=true] Whether to omit the section from the ToC
		* @property {String|Number} [sortValue] Optional overriding sort value, if omitted each section is run via `sortBy` to compute this
		*/
		tocSections: [],

	}},
	props: {

		/**
		* How to treat the scrolling animation
		*
		* @type {'smooth'|'instant'|'auto'}
		*/
		behavior: {type: String, default: 'smooth', validator: v => ['smooth', 'instant', 'auto'].includes(v)},


		/**
		* How to scroll on the X axis
		*
		* @type {'start'|'center'|'end'|'nearest'}
		*/
		xScrolling: {type: String, default: 'start', validator: v => ['start', 'center', 'end', 'nearest'].includes(v)},


		/**
		* How to scroll on the Y axis
		*
		* @type {'start'|'center'|'end'|'nearest'}
		*/
		yScrolling: {type: String, default: 'start', validator: v => ['start', 'center', 'end', 'nearest'].includes(v)},

	},
	methods: {

		/**
		* Register a child element within the ToC
		*
		* @param {VueComponent} childComponent The child component to register, usually a <table-of-contents-section> Vue component
		* @param {Object} [options] Additional options to mutate behaviour, see the definition of `tocSections` for the full list of available options
		*/
		registerSection(childComponent, options) {
			let newSection = {
				component: childComponent,
				...options,
			};
			this.tocSections.push(newSection);
			this.$emit('newSection', newSection);
		},


		/**
		* Scroll to and display a named section
		*
		* @type {String} title The title of the section to jump to
		*/
		scrollTo(title) {
			let section = this.tocSections.find(section => section.title == title);
			if (!section) throw new Error(`<table-of-contents-area>.scrollTo('${title}') not found`);

			section.component.$el.scrollIntoView({
				behavior: this.behavior,
				block: this.yScrolling,
				inline: this.xSCrolling,
			});

			this.$emit('selectSection', section.component);
			this.$el.dispatchEvent(new CustomEvent('selectSection', {detail: section}));
			section.component.$emit('click', section);
		},

	},
}
</script>

<template>
	<slot name="default"/>
</template>
