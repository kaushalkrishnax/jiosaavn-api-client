#!/usr/bin/env bun
import { build } from 'bun'
import { rmSync } from 'fs'

// Clean dist
try {
  rmSync('dist', { recursive: true, force: true })
} catch {}

console.log('Building package...')

// Build ESM
await build({
  entrypoints: ['./index.ts'],
  outdir: './dist',
  target: 'node',
  format: 'esm',
  minify: false,
  sourcemap: 'external',
  external: ['node-forge']
})

// Build CommonJS
await build({
  entrypoints: ['./index.ts'],
  outdir: './dist',
  target: 'node',
  format: 'cjs',
  naming: '[dir]/[name].cjs',
  minify: false,
  sourcemap: 'external',
  external: ['node-forge']
})

// Generate TypeScript declarations
await Bun.$`bunx tsc --declaration --emitDeclarationOnly --outDir dist`

console.log('✓ Build complete!')
console.log('  dist/index.js (ESM)')
console.log('  dist/index.cjs (CommonJS)')
console.log('  dist/index.d.ts (TypeScript)')
