import { build, context } from 'esbuild'
import { cp, mkdir, rm } from 'node:fs/promises'

const watch = process.argv.includes('--watch')

await rm('dist', { recursive: true, force: true })
await mkdir('dist', { recursive: true })

const options = {
  entryPoints: ['src/background.ts', 'src/popup.ts', 'src/content.ts'],
  outdir: 'dist',
  bundle: true,
  format: 'esm',
  target: 'chrome120',
  sourcemap: watch ? 'inline' : false,
  minify: !watch,
  external: ['chrome'],
}

await cp('src/manifest.json', 'dist/manifest.json')
await cp('src/popup.html', 'dist/popup.html')
await cp('src/popup.css', 'dist/popup.css')

if (watch) {
  const ctx = await context(options)
  await ctx.watch()
  console.log('watching…')
} else {
  await build(options)
  console.log('built dist/')
}
