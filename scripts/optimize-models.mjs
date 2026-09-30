import { NodeIO } from '@gltf-transform/core'
import { ALL_EXTENSIONS, EXTMeshoptCompression } from '@gltf-transform/extensions'
import { dedup, prune, reorder } from '@gltf-transform/functions'
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer'
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'

const ROOT = process.cwd()
const MODELS = ['risa-sitting.glb', 'risa-falling.glb']

function bounds(doc) {
  const min = [Infinity, Infinity, Infinity]
  const max = [-Infinity, -Infinity, -Infinity]
  for (const mesh of doc.getRoot().listMeshes()) {
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute('POSITION')
      if (!pos) continue
      const arr = pos.getArray()
      for (let i = 0; i < arr.length; i += 3) {
        for (let k = 0; k < 3; k++) {
          const v = arr[i + k]
          if (v < min[k]) min[k] = v
          if (v > max[k]) max[k] = v
        }
      }
    }
  }
  return { min, max }
}

function sized(byteLength) {
  return `${(byteLength / 1048576).toFixed(2)} MB`
}

async function optimize(io, name) {
  const src = join(ROOT, 'assets', '3D_model', name)
  const pub = join(ROOT, 'public', 'assets', '3D_model', name)
  if (!existsSync(src)) {
    console.warn(`skip ${name}: not found at ${src}`)
    return
  }

  const doc = await io.read(src)
  const originalBytes = statSync(src).size
  const before = bounds(doc)

  const root = doc.getRoot()
  for (const mesh of root.listMeshes())
    for (const prim of mesh.listPrimitives())
      prim.setMaterial(null)
  for (const material of root.listMaterials()) material.dispose()
  for (const texture of root.listTextures()) texture.dispose()

  await doc.transform(dedup(), prune(), reorder({ encoder: MeshoptEncoder, target: 'size' }))
  doc
    .createExtension(EXTMeshoptCompression)
    .setRequired(true)
    .setEncoderOptions({ method: EXTMeshoptCompression.EncoderMethod.FILTER })

  const output = await io.writeBinary(doc)
  mkdirSync(dirname(pub), { recursive: true })
  writeFileSync(src, output)
  writeFileSync(pub, output)

  const reread = await io.readBinary(output)
  const after = bounds(reread)
  const identical =
    JSON.stringify(before.min) === JSON.stringify(after.min) &&
    JSON.stringify(before.max) === JSON.stringify(after.max)

  console.log(
    `${name.padEnd(20)} buffer ${sized(originalBytes).padStart(8)} -> ${sized(
      output.byteLength
    ).padStart(8)} | positions identical: ${identical}`
  )
  if (!identical) {
    console.log('  before', before)
    console.log('  after ', after)
    process.exitCode = 1
  }
}

async function main() {
  await MeshoptEncoder.ready
  await MeshoptDecoder.ready
  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
      'meshopt.encoder': MeshoptEncoder,
      'meshopt.decoder': MeshoptDecoder,
    })

  for (const name of MODELS) await optimize(io, name)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
