import DateComponent from '#components/date';

export default {
	title: 'Components/Date',
	component: DateComponent,
	tags: ['autodocs'],
	argTypes: {
		// ... all other args are magically decoded from JSDoc //
		display: {
			control: 'select',
			options: ['auto', 'relative', 'date'],
		},
		localeDateStyle: {
			control: 'select',
			options: ['full', 'long', 'medium', 'short'],
		},
		localeTimeStyle: {
			control: 'select',
			options: ['full', 'long', 'medium', 'short'],
		},
		relativeCutoff: {
			control: {
				type: 'number',
				min: 0,
				step: 1000 * 6000, //~ 1m
			},
		},
	},
}

export const RelativeValue = {
	args: {
		value: new Date(Date.now() - (1000 * 60 * 2)), //~ Now - 2m
	},
}

export const DateValue = {
	args: {
		value: new Date('2023-01-23T10:00:23'),
	},
}

export const StringValue = {
	args: {
		value: '2023-02-27T12:13:45',
	},
}
