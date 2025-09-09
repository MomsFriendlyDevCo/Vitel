<script>
/**
* Wrapper around the native DOM `<input type="datetime-local">` element to accept and return sane responses
*
* - Tolerant of input types - can pass either native JS Dates or ISO parsable strings
* - Multiple output types supported - Dates, ISO8601 strings, dates (no time) and Times (no dates)
* - Zero dependencies
* - Uses native HTML components only - should work with mobile devices out of the box
*/
export default {
	emits: ['update:modelValue'],
	props: {

		/**
		* V-model binding
		*
		* @type {String|Date}
		*/
		modelValue: {type: [String, Date]},


		/**
		* Output type required
		*
		* @type {'date'|'iso8601'|'iso8601-date'|'iso8601-time'} 'date' (JS Date instance), 'iso8601' (ISO8601 full output string), 'iso8601-date' (ISO8601 string with only the date component), 'iso8601-time' (ISO8601 string with only the time component - everything after "T")
		*/
		type: {type: String, default: 'date', validator: v => ['date', 'iso8601', 'iso8601-date', 'iso8601-time'].includes(v)},


		/**
		* Format the new value into a pure date, pure time or combined date (or object) before emitting
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
				case 'date':
					return asDate;
				case 'iso8601':
					return asDate.toISOString();
				case 'iso8601-date':
					return this.formatAsDate(asDate);
				case 'iso8601-time':
					return this.formatTimeString(asDate);
				default:
					throw new Error(`Unsupported date-picker type "${t}"`);
			}
		}},


		/**
		* Take a date (either from prop input or from user change events) and mask out the date component leaving only the time
		*
		* @param {Date} date The input date object, which may contain the day/month/year component
		*
		* @returns {Date} A date object with the day/month/year component removed (or otherwise masked to a value)
		*/
		timeMask: {type: Function, default(date) {
			let base = new Date(date.toISOString()); // CLone date
			base.setDate(0);
			base.setMonth(0);
			base.setYear(0);
			return base;
		}},
	},
	computed: {

		/**
		* Convert the input value (string or Date) into a native JS Date instance
		*
		* @returns {Date|Null} The native JS Date object for `modelValue`, or null if one isn't provided
		*/
		inputValueAsDate() {
			if (!this.modelValue) { // Empty value
				return null;
			} else if (this.modelValue instanceof Date) { // Given raw Date - use that
				this.checkDateOrThrow(this.modelValue);
				return this.modelValue;
			} else if (typeof this.modelValue == 'string' && ['date', 'iso8601', 'iso8601-date'].includes(this.type)) { // Expecting a full date and given a string - assume ISO8601 and parse that into a Date
				this.checkDateOrThrow(this.modelValue);
				let candidateDate = new Date(this.modelValue);
				if (Number.isNaN(candidateDate) || candidateDate.toISOString() != this.modelValue) throw new Error(`Invalid date input "${this.modelValue}"`);
				return candidateDate;
			} else if (typeof this.modelValue == 'string' && ['iso8601-time'].includes(this.type)) { // Expecting a time component - assume "THH:MM:SS.MMM" or similar and mask that into a Date
				this.checkDateOrThrow(this.modelValue);
				let candidateDateTime = new Date(this.modelValue); // Try to parse as a date
				if (!Number.isNaN(candidateDateTime) && candidateDateTime.toISOString() == this.modelValue) { // Parsed as ISO8601 date from string input
					return this.timeMask(candidateDateTime);
				} else { // Try to parse only time component
					let timeParser = /^T?(?<hour>\d{1,2}):(?<min>\d{1,2})(?::(?<sec>\d{1,2}))?(?:.(?<ms>\d{1,3}))?$/.exec(this.modelValue)?.groups;
					if (!timeParser) throw new Error(`Unable to parse input time string "${this.modelValue}"`);
					let dateTime = new Date();
					dateTime.setHour(timeParser.hour);
					dateTime.setMinute(timeParser.min || 0);
					dateTime.setSecond(timeParser.sec || 0);
					dateTime.setMilliseconds(timeParser.ms || 0);
					return this.timeMask(dateTime);
				}
			} else {
				throw new Error(`Unsupported date input type "${this.modelValue}"`);
			}
		},


		/**
		* Convert the input value (from `inputValueAsDate()`) into the various formats `<input :type="domType">` needs
		*
		* @returns {String} The DOM compatible string, suitable for populating `<input :type="domType" :value>`
		*/
		domValue() {
			if (!this.inputValueAsDate) return ''; // No value present

			switch (this.type) {
				case 'date':
				case 'iso8601':
					return this.formatDateTimeString(this.inputValueAsDate);
				case 'iso8601-date':
					return this.formatDateString(this.inputValueAsDate);
				case 'iso8601-time':
					return this.formatTimeString(this.inputValueAsDate);
				default:
					throw new Error(`Unsupported date-picker type "${this.type}"`);
			}
		},


		/**
		* Determine the <input> type to use within the DOM from the various input formats
		*
		* @returns {String} The DOM compatible `<input :type>` value
		*/
		domType() {
			switch (this.type) {
				case 'date':
				case 'iso8601':
					return 'datetime-local';
				case 'iso8601-date':
					return 'date';
				case 'iso8601-time':
					return 'time';
				default:
					throw new Error(`Unsupported date-picker type "${this.type}"`);
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
			this.$emit('update:modelValue', newValue);
		},


		/**
		* Utility function to check if a given Date object is valid
		* This function tries to be as useful as it can when throwing but for best results pass it a raw value like a string
		*
		* @param {Date|String} date The date object to validate as either a Date instance OR parsable string
		*/
		checkDateOrThrow(date) {
			if (date instanceof Date) {
				if (isNaN(date.getTime())) throw new Error('Input Date object is not valid');
			} else if (typeof date == 'string') {
				let dateObject = new Date(date);
				if (isNaN(dateObject)) throw new Error(`Input date string "${date}" is not valid`);
			} else {
				throw new Error(`Unknown date type ${date}`);
			}
		},


		/**
		* Utility function to convert a native JS Date into the DOM value needed by `<input type="datetime-local">`
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
		* Utility function to convert a native JS Date into the DOM value needed by `<input type="date">`
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
		* Utility function to convert a native JS Date into the DOM value needed by `<input type="time">`
		*
		* @param {Date} v Input date to format
		* @returns {String} The DOM time type
		*/
		formatTimeString(v) {
			return [
				(''+v.getHours()).padStart(2, '0'),
				':',
				(''+v.getMinutes()).padStart(2, '0'),
				...(v.getSeconds() > 0 ? [
					':',
					(''+v.getSeconds()).padStart(2, '0'),
				] : []),
				...(v.getMilliseconds() > 0 ? [
					'.',
					(''+v.getMilliseconds()).padStart(3, '0'),
				] : []),
			].join('');
		},
	},
}
</script>

<template>
	<input
		:value="domValue"
		:type="domType"
		@change="change"
	/>
</template>
