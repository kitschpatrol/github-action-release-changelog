import * as core from '@actions/core'
import { readChangelog } from './changelog'
import { generateChangelog } from './git'

try {
	const changelog = (await readChangelog()) ?? (await generateChangelog())
	core.setOutput('changelog', changelog)
	core.info(changelog)
} catch (error) {
	core.setFailed(`Action failed with error: ${String(error)}`)
}
