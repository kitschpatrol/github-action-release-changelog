import { build } from 'esbuild'

await build({
	banner: {
		// Support CommonJS dependencies that require Node built-in modules.
		js: 'import{createRequire as __esbuild_cr}from"node:module";const require=__esbuild_cr(import.meta.url);',
	},
	bundle: true,
	entryPoints: ['src/index.ts'],
	format: 'esm',
	outdir: 'dist',
	platform: 'node',
	target: 'node24',
})
