import assert from 'node:assert/strict'
import test from 'node:test'
import { nextVersion } from '../scripts/bump-version.mjs'

const SEP_20_2026 = new Date(2026, 8, 20)

test('first run with no current version starts at build 1', () => {
  assert.equal(nextVersion(null, SEP_20_2026), '26.09.20.1')
  assert.equal(nextVersion('', SEP_20_2026), '26.09.20.1')
})

test('same-day increment raises the build number', () => {
  assert.equal(nextVersion('26.09.20.1', SEP_20_2026), '26.09.20.2')
  assert.equal(nextVersion('26.09.20.41', SEP_20_2026), '26.09.20.42')
})

test('day rollover resets the build to 1', () => {
  assert.equal(nextVersion('26.09.19.7', SEP_20_2026), '26.09.20.1')
})

test('month rollover resets the build to 1', () => {
  assert.equal(nextVersion('26.08.31.7', SEP_20_2026), '26.09.20.1')
})

test('year rollover resets the build to 1', () => {
  assert.equal(nextVersion('25.12.31.9', new Date(2026, 0, 1)), '26.01.01.1')
})

test('old 3-segment input is treated as a fresh start', () => {
  assert.equal(nextVersion('26.09.1', SEP_20_2026), '26.09.20.1')
  assert.equal(nextVersion('26.09.42', SEP_20_2026), '26.09.20.1')
})

test('unparseable input is treated as a fresh start', () => {
  assert.equal(nextVersion('not-a-version', SEP_20_2026), '26.09.20.1')
  assert.equal(nextVersion('26.09.20.8a4a1cd', SEP_20_2026), '26.09.20.1')
})

test('month and day are zero-padded and output matches yy.mm.dd.build', () => {
  assert.equal(nextVersion(null, new Date(2026, 0, 5)), '26.01.05.1')
  assert.match(nextVersion('26.09.20.1', SEP_20_2026), /^\d{2}\.\d{2}\.\d{2}\.\d+$/)
  assert.match(nextVersion(null, SEP_20_2026), /^\d{2}\.\d{2}\.\d{2}\.\d+$/)
})
