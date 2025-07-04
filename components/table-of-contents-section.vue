<script>
/**
* Marker for a Table-of-Contents section within a <table-of-contents-area/> component
*
* @emits click Emitted as `(tocSection:VueComponent)` when the section is clicked / navigated to
*/
export default {
	emits: ['click'],
	inject: ['toc'], // Require a (eventual) parent TOC(<table-of-contents>) parent
	props: {

		/**
		* The human-readable title for the section
		* Contents are HTML
		*
		* @type {String}
		*/
		title: {type: String, required: true},


		/**
		* Whether to list the current section in the table-of-contents
		*
		* @type {Boolean}
		*/
		show: {type: Boolean, default: true},


		/**
		* Optional sortBy criteria to override the <table-of-contents> sort function
		*
		* @type {String|Number}
		*/
		sortValue: {type: [String, Number]},

	},
	created() {
		this.toc.registerSection(this, {
			title: this.title,
			show: this.show,
			sortValue: this.sortValue,
		});
	},
}
</script>

<template>
	<div class="table-of-contents-section"/>
</template>
