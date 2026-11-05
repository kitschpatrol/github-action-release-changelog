import { cspellConfig } from '@kitschpatrol/cspell-config'

export default cspellConfig({
	ignorePaths: ['dist/**', 'test/fixtures/**'],
	words: ['gpgsign', 'NOSYSTEM'],
})
