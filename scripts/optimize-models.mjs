import { readdirSync, mkdirSync, existsSync, statSync } from 'node:fs'
import { join, basename } from 'node:path'
import { execFileSync } from 'node:child_process'

const SRC_DIR = 'assets/3D_model'
const OUT_DIR = 'public/assets/3D_model'
const OPTIONS = [
  '--compress', 'meshopt',
  '--texture-compress', 'webp',
  '--texture-size', '1024',
]

if (!existsSync(SRC_DIR)) {
  console.error(`Source directory not found: ${SRC_DIR}`)
  process.exit(1)
}

mkdirSync(OUT_DIR, { recursive: true })

const models = readdirSync(SRC_DIR).filter((f) => f.toLowerCase().endsWith('.glb'))

if (models.length === 0) {
  console.error(`No .glb files found in ${SRC_DIR}`)
  process.exit(1)
}

for (const file of models) {
  const input = join(SRC_DIR, file)
  const output = join(OUT_DIR, basename(file))
  const before = statSync(input).size
  process.stdout.write(`\nOptimizing ${file} (${(before / 1048576).toFixed(2)} MB)...\n`)
  execFileSync('pnpm', ['exec', 'gltf-transform', 'optimize', input, output, ...OPTIONS], {
    stdio: 'inherit',
  })
  const after = statSync(output).size
  const saved = (100 * (1 - after / before)).toFixed(1)
  console.log(`-> ${(after / 1048576).toFixed(2)} MB (${saved}% smaller)`)
}

console.log('\nDone.')
