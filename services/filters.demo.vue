<script>
export default {
	computed: {
		filtersState() {
			return {
				filters: Object.fromEntries( // Convert to a nicer layout so we don't upset the Vue JSON renderer
					Object.entries(this.$filters.filters)
						.map(([key]) => [key, `[${key} filter]`])
				),
			};
		},
	},
}
</script>

<template>
	<div>
		<div class="card mb-2">
			<div class="card-header">$filters.filters</div>
			<div class="card-body">
				<p>Access for loaded filters.</p>
				<pre>$filters: {{filtersState}}</pre>
			</div>
		</div>
		<div class="card mb-2">
			<div class="card-header">$filters examples</div>
			<div class="card-body">

				<div class="row">
					<div class="col-8">
						<code v-pre>{{$filters.number(123456789)}}</code>
					</div>
					<div class="col-4">
						<pre>{{$filters.number(123456789)}}</pre>
					</div>
				</div>

				<div class="row">
					<div class="col-8">
						<code v-pre>{{$filters.pipe(123456789, 'number')}}</code>
					</div>
					<div class="col-4">
						<pre>{{$filters.pipe(123456789, 'number')}}</pre>
					</div>
				</div>

				<div class="row">
					<div class="col-8">
						<code v-pre>{{$filters.pipe(123456789, 'currency')}}</code>
					</div>
					<div class="col-4">
						<pre>{{$filters.pipe(123456789, 'currency')}}</pre>
					</div>
				</div>

				<div class="row">
					<div class="col-8">
						<code v-pre>{{$filters.pipe(2, 'currency', ['pluralize', '[dollar|dollars]'])}}</code>
					</div>
					<div class="col-4">
						<pre>{{$filters.pipe(2, 'currency', ['pluralize', '[dollar|dollars]'])}}</pre>
					</div>
				</div>

			</div>
		</div>
	</div>
</template>
