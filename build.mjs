import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { build, context } from 'esbuild'

const watch = process.argv.includes('--watch')

// The API the extension talks to. It is set at build time so the code, the
// manifest's host permissions and the published package cannot drift apart.
//
// The default is the production domain. To build against a deployment on
// another host, set API_URL when building:
//   API_URL=https://yotajob-api-xxxx.ondigitalocean.app pnpm build
const API_URL = (process.env.API_URL ?? 'https://api.yotajob.com').replace(/\/+$/, '')
const WEB_URL = (process.env.WEB_URL ?? 'https://yotajob.com').replace(/\/+$/, '')

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
  // The endpoints are injected here, so the source keeps one place for them
  // and the build decides what they are.
  define: {
    __API_URL__: JSON.stringify(API_URL),
    __WEB_URL__: JSON.stringify(WEB_URL),
  },
}

await cp('manifest.json', 'dist/manifest.json')
await cp('src/popup.html', 'dist/popup.html')
await cp('src/popup.css', 'dist/popup.css')

// The manifest's host permissions have to cover the API the build points at.
const manifest = JSON.parse(await readFile('manifest.json', 'utf-8'))
manifest.host_permissions = [`${API_URL}/*`]
await writeFile('dist/manifest.json', `${JSON.stringify(manifest, null, 2)}\n`)

if (watch) {
  const ctx = await context(options)
  await ctx.watch()
  console.log('watching…')
} else {
  await build(options)
  console.log(`built dist/ → ${API_URL}`)
}
