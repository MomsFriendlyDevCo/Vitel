<script>
import Digest from './digest.vue';


/**
* Generic single statistics display widget
*
* Can display simple stats as well as wrapping `VALUE / MAX` style displays using the <digest> component (with caching)
*/
export default {
	components: {
		Digest,
	},
	props: {

		/**
		* Human readable (brief) text to display
		*
		* @type {String},
		*/
		title: String,


		/**
		* Icon class to display for the stat
		*
		* @type {String}
		*/
		icon: {type: String, default: 'fas fa-circle-info'},


		/**
		* Current count of the stat
		* Populate this if the information is already available
		*
		* @type {Number|String}
		*/
		value: {type: [Number, String]},


		/**
		* Digest compatible URL of the stat to fetch from
		* This will automatically display a spinner while its being fetched
		*
		* @type {String|Object}
		*/
		valueUrl: {type: [String, Object]},


		/**
		* Cache time for the valueUrl
		*
		* @type {String}
		*/
		valueUrlCache: {type: String, default: '1m'},


		/**
		* Optional number maximum
		* Populate this if the information is already available
		*
		* @type {Number|String}
		*/
		max: {type: [Number, String]},


		/**
		* Digest compatible URL of the maximum stat value
		* This will automatically display a spinner while its being fetched
		*
		* @type {String|Object}
		*/
		maxUrl: {type: [String, Object]},


		/**
		* Cache time for the maxUrl
		*
		* @type {String}
		*/
		maxUrlCache: {type: String, default: '1m'},


		/**
		* Sync callback function to unpack the requested endpoint URL payload and format it into the field required
		* Default behaviour is to use the first available finite object value
		* Called as `(data:Object)`
		*
		* @type {Function}
		*/
		unpack: {type: Function, default: data => {
			if (typeof data != 'object') {
				console.log('<stat-display> expected an object but got', {data});
				throw new Error('Recieved non-object for <stat-display> unpack()');
			}

			return Object.values(data)
				.find(v => Number.isFinite(v))
		}},


		/**
		* Formatting function to use when processing eventual values
		* Should be able to accept String + Number inputs and returns a String
		* Called as `(value:String|Number)`
		*
		* @type {Function}
		*/
		format: {type: Function, default: value => {
			return Number(value).toLocaleString();
		}},
	},
}
</script>

<template>
	<div class="stat-display card">
		<div class="card-body d-flex">
			<div class="stat-display-icon">
				<i :class="icon"/>
			</div>
			<div class="stat-display-body">
				<div class="stat-display-values">
					<div v-if="value" class="stat-display-value">
						{{format(value)}}
					</div>
					<digest
						v-else-if="valueUrl"
						:url="valueUrl"
						field="*"
						:cache="valueUrlCache"
						class="stat-display-value"
					>
						<template #loading>
							<i class="far fa-spinner fa-spin"/>
						</template>
						<template #display="{data}">
							{{format(unpack(data))}}
						</template>
					</digest>

					<div v-if="max || maxUrl" class="stat-display-divider">
						/
					</div>

					<div v-if="max" class="stat-display-max">
						{{format(max)}}
					</div>
					<digest
						v-else-if="maxUrl"
						:url="maxUrl"
						field="*"
						:cache="maxUrlCache"
						class="stat-display-max"
					>
						<template #loading>
							<i class="far fa-spinner fa-spin"/>
						</template>
						<template #display="{data}">
							{{format(unpack(data))}}
						</template>
					</digest>
				</div>

				<div class="stat-display-title">
					{{title}}
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss">
.stat-display {
	--stat-display-height: 150px;
	--stat-display-width: 350px;
	height: var(--stat-display-height);
	width: var(--stat-display-width);
	padding: 10px;

	display: flex;

	& .stat-display-icon {
		width: 30%;
		font-size: 72px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	& .stat-display-body {
		height: 100%;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: end;
		justify-content: space-between;

		& .stat-display-values {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: end;
			font-size: 24px;

			& .stat-display-value {
				color: var(--bs-primary);
			}

			& .stat-display-divider {
				color: var(--bs-light);
				margin: 0 10px;
			}

			& .stat-display-max {
				color: var(--bs-secondary);
			}
		}
	}

	& .stat-display-title {
		text-align: right;
	}
}
</style>
