import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { parseToml } from '../app/utils/toml.ts'

const EXPECTED_CODES = [
  'en',
  'zh-CN',
  'hi',
  'es',
  'ar',
  'fr',
  'bn',
  'pt',
  'ru',
  'id',
  'ur',
  'de',
  'ja',
  'ha',
  'mr',
  'te',
  'tr',
  'ta',
  'vi',
  'zh-TW',
  'ko',
  'jv',
  'it',
  'fa',
  'gu',
  'pa',
  'th',
  'am',
  'uk',
  'yo',
  'kn',
  'ml',
  'or',
  'my',
  'sw',
  'ms',
  'ro',
  'ne',
  'si',
  'km',
  'nl',
  'el',
  'hu',
  'cs',
  'sv',
  'pl',
  'da',
  'fi',
  'no',
  'he',
  'bg',
  'hr',
  'sk',
  'sl',
  'sr',
  'et',
  'lv',
  'lt',
  'fil',
  'af',
  'zu',
  'xh',
  'so',
  'ig',
  'az',
  'ka',
  'hy',
  'kk',
  'ky',
  'uz',
  'tg',
  'tk',
  'mn',
  'ps',
  'ku',
  'ckb',
  'sd',
  'lo',
  'eu',
  'ca',
  'gl',
  'cy',
  'ga',
  'mt',
  'sq',
  'mk',
  'be',
  'bs',
  'yi',
  'ht',
  'mg',
  'ny',
  'sn',
  'st',
  'su',
  'om',
  'mai',
  'bho',
  'ceb',
  'rw',
  'ln',
  'bm',
  'ak',
  'ee',
  'ti',
  'as',
  'dv',
  'mni-Mtei',
]

const APPROX_CODES = ['ps', 'ku', 'ckb', 'be', 'ln']

function loadLanguages() {
  const source = readFileSync(new URL('../app/data/languages.toml', import.meta.url), 'utf8')
  const parsed = parseToml(source).language
  assert.ok(Array.isArray(parsed), 'expected TOML table array: language')
  return parsed as Array<Record<string, unknown>>
}

function findLanguage(rows: Array<Record<string, unknown>>, code: string) {
  const row = rows.find(entry => entry.code === code)
  assert.ok(row, `missing ${code}`)
  return row
}

test('yields 108 codes in TOML order', () => {
  const rows = loadLanguages()
  assert.deepEqual(rows.map(entry => entry.code), EXPECTED_CODES)
})

test('has no duplicate language codes', () => {
  const rows = loadLanguages()
  assert.equal(new Set(rows.map(entry => entry.code)).size, rows.length)
})

test('every entry has a non-empty name and users_millions above zero', () => {
  const rows = loadLanguages()
  for (const entry of rows) {
    assert.equal(typeof entry.name, 'string', `missing name for ${String(entry.code)}`)
    assert.ok((entry.name as string).length > 0, `empty name for ${String(entry.code)}`)
    assert.equal(typeof entry.users_millions, 'number', `missing users_millions for ${String(entry.code)}`)
    assert.ok((entry.users_millions as number) > 0, `non-positive users_millions for ${String(entry.code)}`)
  }
})

test('spot checks speaker totals', () => {
  const rows = loadLanguages()
  assert.deepEqual(findLanguage(rows, 'en'), { code: 'en', name: 'English', users_millions: 1493 })
  assert.equal(findLanguage(rows, 'hi').users_millions, 611)
  assert.deepEqual(findLanguage(rows, 'dv'), { code: 'dv', name: 'Dhivehi', users_millions: 0.4 })
})

test('flags rough estimates with approx', () => {
  const rows = loadLanguages()
  for (const entry of rows) {
    if (APPROX_CODES.includes(entry.code as string)) {
      assert.equal(entry.approx, true, `missing approx flag for ${String(entry.code)}`)
    } else {
      assert.equal(entry.approx, undefined, `unexpected approx flag for ${String(entry.code)}`)
    }
  }
})
