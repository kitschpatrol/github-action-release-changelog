import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	entry: ['src/index.ts', 'scripts/*.ts'],
	ignore: ['dist/**'],
	ignoreDependencies: [
		'@kitschpatrol/chagent', // Typically invoked through bumpp's --execute argument, which Knip doesn't parse
	],
})
