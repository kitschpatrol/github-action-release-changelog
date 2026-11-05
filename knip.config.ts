import { knipConfig } from '@kitschpatrol/knip-config'

export default knipConfig({
	entry: ['src/index.ts', 'scripts/*.ts'],
	ignore: ['dist/**'],
})
