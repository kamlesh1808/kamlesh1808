import assert from 'node:assert/strict'
import test from 'node:test'
import { nextVersion } from '../scripts/bump-version.mjs'

const SEP_2026 = new Date(2026, 8, 20)

test('first run with no current version starts at build 1', () => {
  assert.equal(nextVersion(null, SEP_2026), '26.09.1')
  assert.equal(nextVersion('', SEP_2026), '26.09.1')
})

test('same yy.mm increments the build number', () => {
  assert.equal(nextVersion('26.09.1', SEP_2026), '26.09.2')
  assert.equal(nextVersion('26.09.41', SEP_2026), '26.09.42')
})

test('month rollover resets the build to 1', () => {
  assert.equal(nextVersion('26.08.7', SEP_2026), '26.09.1')
})

test('year rollover resets the build to 1', () => {
  assert.equal(nextVersion('25.12.9', new Date(2026, 0, 2)), '26.01.1')
})

test('unparseable input is treated as a fresh start', () => {
  assert.equal(nextVersion('not-a-version', SEP_2026), '26.09.1')
  assert.equal(nextVersion('26.9.1', SEP_2026), '26.09.1')
})

test('hash-format input (no numeric counter) is treated as a fresh start', () => {
  assert.equal(nextVersion('26.09.8a4a1cd', SEP_2026), '26.09.1')
})

test('month is zero-padded and output matches yy.mm.build', () => {
  assert.equal(nextVersion(null, new Date(2026, 0, 5)), '26.01.1')
  assert.match(nextVersion('26.09.1', SEP_2026), /^\d{2}\.\d{2}\.\d+$/)
  assert.match(nextVersion(null, SEP_2026), /^\d{2}\.\d{2}\.\d+$/)
})
