<script>
/**
* Wrapper around the native DOM `<input type="datetime-local">` element to accept and return sane responses
*/
export default {
	emits: ['update:modelValue'],
	props: {

		/**
		* V-model binding
		* @type {String|Date}
		*/
		modelValue: {type: [String, Date]},


		/**
		* Output type required
		* @type {'iso'}
		*/
		type: {type: String, default: 'iso', validator: v => ['iso'].includes(v)},


		/**
		* Format the new vaue into a pure date, pure time or combined date (or object) before emitting
		* Can be overriden / subclassed
		*
		* @param {String} v The input string to format
		* @param {String} t The desired output format, see `type`
		* @param {VueComponent} c This VueComponent
		* @returns {*} The output in the required format
		*/
		format: {type: Function, default(v, t) {
			let asDate = new Date(v);

			switch (t) {
				case 'iso':
					return asDate.toISOString();
				case 'iso-date':
					return this.formatAsDate(asDate);
				default:
					throw new Error(`Unsupported date-picker type "${t}"`);
			}
		}},
	},
	computed: {

		/**
		* Convert the input value (string or Date) into a native JS Date instance
		*
		* @returns {Date} The native JS Date object for `modelValue`
		*/
		inputValueAsDate() {
			if (this.modelValue instanceof Date) {
				return this.modelValue;
			} else if (typeof this.modelValue == 'string') {
				let candidateDate = new Date(this.modelValue);
				if (Number.isNaN(candidateDate) || candidateDate.toISOString() != this.modelValue) throw new Error(`Invalid date input "${this.modelValue}"`);
				return candidateDate;
			} else {
				throw new Error('Unsupported date input type');
			}
		},


		/**
		* Convert the input value (from `inputValueAsDate()`) into the various formats `<input :type="domType">` needs
		*
		* @returns {String} The DOM compatible string, suitable for populateing `<input :type="domType">`
		*/
		domValue() {
			switch (this.type) {
				case 'iso':
					let give = this.formatDateTimeString(this.inputValueAsDate);
					console.log('New DOM value =', give);
					return give;
				case 'iso-date': return this.formatDateString(this.inputValueAsDate);
				case 'iso-time': return this.formatTimeString(this.inputValueAsDate);
				default: throw new Error(`Unsupported date-picker type "${this.type}"`);
			}
		},


		/**
		* Determine the <input> type to use within the DOM from the various input formats
		*
		* @returns {String} The DOM compatible `<input type>` value
		*/
		domType() {
			switch (this.type) {
				case 'iso': return 'datetime-local';
				case 'iso-date': return 'date';
				case 'iso-time': return 'time';
				default: throw new Error(`Unsupported date-picker type "${this.type}"`);
			}
		},
	},
	methods: {

		/**
		* Event capture when the type changes
		*
		* Convert the native DOM type back to a Date / ISO type and emit
		*
		* @param {Event} e The change event fired by the DOM
		*/
		change(e) {
			let newValue = this.format.call(this, e.target.value, this.type, this);
			console.log('NEW VALUE', newValue);
			this.$emit('update:modelValue', newValue);
		},


		/**
		* Utility function to convert a native JS Date into the DOM type needed by `<input type="datetime-local">`
		*
		* @param {Date} v Input date to format
		* @returns {String} The DOM datetime-local type
		*/
		formatDateTimeString(v) {
			return (
				this.formatDateString(v)
				+ 'T'
				+ this.formatTimeString(v)
			);
		},


		/**
		* Utility function to convert a native JS Date into the DOM type needed by `<input type="date">`
		*
		* @param {Date} v Input date to format
		* @returns {String} The DOM date type
		*/
		formatDateString(v) {
			return (
				(v.getYear() + 1900)
				+ '-'
				+ (''+(v.getMonth() + 1)).padStart(2, '0')
				+ '-'
				+ (''+v.getDate()).padStart(2, '0')
			);
		},


		/**
		* Utility function to convert a native JS Date into the DOM type needed by `<input type="time">`
		*
		* @param {Date} v Input date to format
		* @returns {String} The DOM time type
		*/
		formatTimeString(v) {
			return (
				(''+v.getHours()).padStart(2, '0')
				+ ':'
				+ (''+v.getMinutes()).padStart(2, '0')
			);
		},
	},
}
</script>

<template>
	<div>
		<input
			:value="domValue"
			:type="domType"
			@change="change"
		/>
	</div>
</template>
