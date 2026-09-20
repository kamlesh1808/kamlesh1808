import assert from 'node:assert/strict'
import test from 'node:test'
import { nextVersion } from '../scripts/bump-version.mjs'

const SEP_20_2026_UTC = new Date(Date.UTC(2026, 8, 20, 4, 7))

test('formats a UTC timestamp build number', () => {
  assert.equal(nextVersion(null, SEP_20_2026_UTC), '26.09.20.0407')
  assert.equal(nextVersion('', SEP_20_2026_UTC), '26.09.20.0407')
})

test('previous version is ignored', () => {
  assert.equal(nextVersion('26.09.20.1', SEP_20_2026_UTC), '26.09.20.0407')
  assert.equal(nextVersion('not-a-version', SEP_20_2026_UTC), '26.09.20.0407')
})

test('uses UTC date fields across local timezone boundaries', () => {
  assert.equal(nextVersion(null, new Date('2026-09-20T23:59:00-05:00')), '26.09.21.0459')
})

test('year rollover uses the UTC year', () => {
  assert.equal(nextVersion(null, new Date(Date.UTC(2026, 0, 1, 0, 1))), '26.01.01.0001')
})

test('date and time parts are zero-padded and output matches yy.mm.dd.hhmm', () => {
  assert.equal(nextVersion(null, new Date(Date.UTC(2026, 0, 5, 6, 3))), '26.01.05.0603')
  assert.match(nextVersion(null, SEP_20_2026_UTC), /^\d{2}\.\d{2}\.\d{2}\.\d{4}$/)
})
