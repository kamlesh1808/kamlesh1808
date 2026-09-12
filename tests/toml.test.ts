import assert from 'node:assert/strict'
import test from 'node:test'
import { parseToml } from '../app/utils/toml.ts'

test('parses tables, arrays, booleans, numbers, comments, and array tables', () => {
  const result = parseToml(`
    title = "Developer #1"
    enabled = true
    years = 10
    tags = ["Nuxt", "TypeScript"]

    [profile]
    name = "Kamlesh Patel"

    [[profile.links]]
    label = "GitHub"
    external = true

    [[profile.links]]
    label = "Email"
    external = false
  `)

  assert.deepEqual(result.title, 'Developer #1')
  assert.deepEqual(result.enabled, true)
  assert.deepEqual(result.years, 10)
  assert.deepEqual(result.tags, ['Nuxt', 'TypeScript'])
  assert.deepEqual(result.profile, {
    name: 'Kamlesh Patel',
    links: [
      { label: 'GitHub', external: true },
      { label: 'Email', external: false },
    ],
  })
})

test('supports multiline arrays and rejects malformed TOML', () => {
  const result = parseToml('items = [\n  "one",\n  "two"\n]')
  assert.deepEqual(result.items, ['one', 'two'])

  assert.throws(() => parseToml('items = ["one",]'), /Trailing comma/)
  assert.throws(() => parseToml('value = unknown'), /Unsupported TOML value/)
  assert.throws(() => parseToml('name = "first"\nname = "second"'), /Duplicate TOML key/)
})
