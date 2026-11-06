import { cspellConfig } from '@kitschpatrol/cspell-config'

export default cspellConfig({
	ignorePaths: ['dist/**', 'test/fixtures/**', '**/changelog.md'],
	words: ['chagent', 'gpgsign', 'NOSYSTEM'],
})
