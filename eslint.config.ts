import { eslintConfig } from '@kitschpatrol/eslint-config'

export default eslintConfig({
	ignores: ['dist/**', 'test/fixtures/**', '**/changelog.md'],
	ts: {
		overrides: {
			// Keep the process runner selected for this action.
			'depend/ban-dependencies': ['error', { allowed: ['execa'] }],
		},
	},
})
