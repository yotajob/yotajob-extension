import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'

const manifest = JSON.parse(readFileSync('dist/manifest.json', 'utf8'))

// The archive lives outside dist/, or zip would try to include itself.
mkdirSync('release', { recursive: true })
const out = resolve(`release/yotajob-extension-${manifest.version}.zip`)

rmSync(out, { force: true })
execFileSync('zip', ['-r', '-q', out, '.'], { cwd: 'dist' })
console.log(`packaged ${out}`)
