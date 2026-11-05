import { execa } from 'execa'

/** Preserve the original version-sorted tag selection and git-log formatting. */
export async function generateChangelog(directory = process.cwd()): Promise<string> {
	const { stdout: tagOutput } = await execa('git', ['tag', '--sort', 'version:refname'], {
		cwd: directory,
	})
	const tags = tagOutput.length > 0 ? tagOutput.split('\n') : []
	const previousTag = tags.at(-2) ?? tags.at(-1)
	const gitArguments = ['log', '--oneline', '--no-decorate']
	if (previousTag !== undefined) {
		gitArguments.push(`${previousTag}..HEAD`)
	}

	const { stdout } = await execa('git', gitArguments, { cwd: directory })
	return stdout
		.split('\n')
		.map((line) => ` - ${line}`)
		.join('\n')
}
