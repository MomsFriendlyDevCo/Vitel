/**
* Nicely format a raw number of bytes into a file size
*
* @param {value} bytes The input value to format
*
* @param {Object} [options] Additional options to mutate behaviour
* @param {Number} [options.decimals=2] Desired number of decimal places
* @param {Number} [options.base=1024] The number base to use when calculating
* @param {Array<String>} [options.sizes] Asending array of calssification sizes
*
* @returns {String} Human readable number
*/
export default function(bytes, options) {
	let settings = {
		decimals: 2,
		base: 1024,
		sizes: ['Bytes', 'KB', 'MB', 'GB', 'TB'],
		...options,
	};

	if (bytes === 0) return '0 Bytes';
	const i = Math.floor(Math.log(bytes) / Math.log(settings.base));
	return parseFloat((bytes / Math.pow(settings.base, i)).toFixed(settings.decimals)) + ' ' + settings.sizes[i];
}
