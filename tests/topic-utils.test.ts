import assert from 'node:assert/strict'
import test from 'node:test'
import { findTopicBySlug, groupTopics, slugifyTopic } from '../app/page-scripts/topic-utils.ts'

test('slugifies topic names consistently', () => {
  assert.equal(slugifyTopic('  AI / Machine Learning  '), 'ai-machine-learning')
  assert.equal(slugifyTopic('Déjà Vu'), 'deja-vu')
})

test('groups topics, ignores empty tags, and counts tags across posts', () => {
  const groups = groupTopics([
    { tags: ['Nuxt', 'AI', ''] },
    { tags: ['nuxt', 'AI'] },
    {},
  ])

  assert.deepEqual(groups, [
    { name: 'AI', slug: 'ai', count: 2 },
    { name: 'Nuxt', slug: 'nuxt', count: 2 },
  ])
  assert.deepEqual(findTopicBySlug(groups, ' NÚXT '), { name: 'Nuxt', slug: 'nuxt', count: 2 })
  assert.equal(findTopicBySlug(groups, 'missing'), undefined)
})
