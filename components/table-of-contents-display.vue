<script>
export default {
	inject: ['toc'], // Require a parent TOC(<table-of-contents>) parent
	props: {

		/**
		* Worker function to compute the sorting criteria which we eventually sort by
		* This is a Schwartzian transform, computation function per item
		*
		* @type {Function} Function worker, called as `(section, sectionIndex)`
		*/
		sortBy: {type: Function, default: ()=> (section, sectionIndex) => sectionIndex},


		/**
		* Style profiles to use when rendering the list
		*
		* @type {'numbered'|'none'}
		*/
		template: {type: String, default: 'none', validator: v => ['numbered', 'none'].includes(v)},

	},
	computed: {

		/**
		* Sort the registered child sections returning the sorted shallow-copied-array
		*
		* @returns {Array} A sorted, filtered version of `tocSections`
		*/
		computedSections() {
			return this.toc.tocSections
				.filter(section => (section.show ?? true))
				.map((section, index) => ({
					sortValue:
						section.sortValue !== undefined
							? section.sortValue
							: this.sortBy(section, index),
					...section,
				}))
				.sort((a, b) =>
					a.sortValue > b.sortValue ? 1
					: a.sortValue < b.sortValue ? -1
					: 0
				)
		},

	},
}
</script>

<template>
	<div class="table-of-contents-display" :class="`table-of-contents-display-${template}`">
		<a
			class="table-of-contents-item"
			v-for="section in computedSections"
			:key="section"
			v-html="section.title"
			@click="toc.scrollTo(section.title)"
		/>
	</div>
</template>

<style lang="scss">
.table-of-contents-display {

	& .table-of-contents-item {
		display: block;
		cursor: pointer;
	}

	/* template=none {{{ */
	/* }}} */

	/* template=numbered {{{ */
	&.table-of-contents-display-numbered {
		counter-reset: toc-counter;
		list-style: none;
		padding-left: 0;

		& .table-of-contents-item {
			counter-increment: toc-counter;
			padding-left: 1.5em;
			position: relative;

			&::before {
			  content: counter(toc-counter) ".";
			  position: absolute;
			  left: 0;
			  font-weight: normal;
			}
		}
	}
	/* }}} */

}
</style>
