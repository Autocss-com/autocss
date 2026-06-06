#!/usr/bin/env node
// SessionStart context reloader for autocss.
// Prints PROGRESS.json (control file) + the tail of the newest shard so any
// session auto-reloads context + why. Pure stdout; no side effects.
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const TAIL = 40

// A reader closing stdout early (e.g. `| head`) must not crash the hook.
process.stdout.on('error', (err) => { if (err.code === 'EPIPE') process.exit(0) })

const read = (p) => readFileSync(resolve(root, p), 'utf8')

try {
  const progressRaw = read('PROGRESS.json')
  const progress = JSON.parse(progressRaw)
  process.stdout.write('=== PROGRESS.json (autocss control file) ===\n')
  process.stdout.write(progressRaw.trimEnd() + '\n\n')

  const shards = Array.isArray(progress.shards) ? progress.shards : []
  const newest = shards[shards.length - 1]
  if (newest) {
    const lines = read(newest).split('\n').filter(Boolean)
    process.stdout.write(`=== ${newest} (last ${TAIL} of ${lines.length} records) ===\n`)
    process.stdout.write(lines.slice(-TAIL).join('\n') + '\n')
  }
} catch (err) {
  process.stdout.write(`[session-start] could not load progress: ${err.message}\n`)
}
