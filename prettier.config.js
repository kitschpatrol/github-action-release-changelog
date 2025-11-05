import { prettierConfig } from '@kitschpatrol/prettier-config'

export default prettierConfig({
	overrides: [
		{
			files: '*.sh',
			options: {
				useTabs: false,
			},
		},
		{
			files: ['*.md'],
			options: {
				singleQuote: false,
			},
		},
	],
})
