import assert from 'node:assert/strict'
import test from 'node:test'
import {
  frontmatterBoolean,
  frontmatterString,
  frontmatterStringArray,
  parseFrontmatter,
} from '../server/utils/frontmatter.ts'

test('parses typed frontmatter fields and preserves colons in values', () => {
  const result = parseFrontmatter(`---
title: "A post: with a colon"
date: 2026-09-12
tags: [Nuxt, "TypeScript"]
disabled: false
---

Post body.
`)

  assert.equal(frontmatterString(result.fields, 'title'), 'A post: with a colon')
  assert.equal(frontmatterString(result.fields, 'date'), '2026-09-12')
  assert.deepEqual(frontmatterStringArray(result.fields, 'tags'), ['Nuxt', 'TypeScript'])
  assert.equal(frontmatterBoolean(result.fields, 'disabled'), false)
  assert.equal(result.body.trim(), 'Post body.')
})

test('rejects duplicate and malformed frontmatter keys', () => {
  assert.throws(() => parseFrontmatter('---\ntitle: One\ntitle: Two\n---\nBody'), /Duplicate frontmatter key/)
  assert.throws(() => parseFrontmatter('---\nnot valid: value\n---\nBody'), /Invalid frontmatter key/)
})

test('returns the original source when frontmatter is absent', () => {
  const source = 'Plain Markdown content'
  assert.deepEqual(parseFrontmatter(source), { fields: {}, body: source })
})
