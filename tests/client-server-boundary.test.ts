import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import test from 'node:test'

function collectAppFiles(dir: URL): URL[] {
  const files: URL[] = []
  const base = dir.href.endsWith('/') ? dir.href : `${dir.href}/`
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.nuxt' || entry === '.output') continue
    const child = new URL(entry, base)
    if (statSync(child).isDirectory()) {
      const childDir = new URL(child.href.endsWith('/') ? child.href : `${child.href}/`)
      files.push(...collectAppFiles(childDir))
    } else if (entry.endsWith('.vue') || entry.endsWith('.ts')) {
      files.push(child)
    }
  }
  return files
}

test('should never import server code when app files are scanned', () => {
  const base = new URL('../app/', import.meta.url)
  const files = collectAppFiles(base)
  assert.ok(files.length > 0, 'expected app files to scan')
  const patterns = [
    'server/utils/posts',
    '~/server',
    '~~/server',
    "from '../server",
    "from '../../server",
    "from '../../../server",
    '/server/api/',
  ]
  const violators: string[] = []
  for (const file of files) {
    const content = readFileSync(file, 'utf8')
    if (patterns.some(pattern => content.includes(pattern))) {
      violators.push(file.href)
    }
  }
  assert.deepEqual(violators, [], `client imported server-only code: ${violators.join(', ')}`)
})

test('should use the safe error module when known client entries are read', () => {
  const entries = [
    new URL('../app/pages/post/[slug].vue', import.meta.url),
    new URL('../app/pages/topics/[topic].vue', import.meta.url),
    new URL('../app/page-scripts/post.ts', import.meta.url),
  ]
  for (const entry of entries) {
    const content = readFileSync(entry, 'utf8')
    assert.ok(content.includes('utils/post-errors'), `missing safe import in ${entry.href}`)
    assert.ok(!content.includes('server/utils/posts'), `server import leaked in ${entry.href}`)
  }
})

test('should re-export shared errors from a single source when server posts util is read', () => {
  const source = readFileSync(new URL('../server/utils/posts.ts', import.meta.url), 'utf8')
  assert.ok(source.includes('app/utils/post-errors'), 'server should re-export shared errors')
  assert.ok(!source.includes('export const NOT_FOUND_ERRORS'), 'local duplicate should be removed')
  assert.ok(source.includes('node:fs'), 'server logic should stay server-side')
  assert.ok(source.includes('process.cwd()'), 'server logic should stay server-side')
})

test('should match real routes when link targets are checked', () => {
  const postCard = readFileSync(new URL('../app/components/PostCard.vue', import.meta.url), 'utf8')
  const topicCard = readFileSync(new URL('../app/components/TopicCard.vue', import.meta.url), 'utf8')
  const tagList = readFileSync(new URL('../app/components/TagList.vue', import.meta.url), 'utf8')
  assert.ok(postCard.includes('/post/'), 'PostCard should link to /post/')
  assert.ok(topicCard.includes('/topics/'), 'TopicCard should link to /topics/')
  assert.ok(tagList.includes('/topics/'), 'TagList should link to /topics/')
  assert.ok(existsSync(new URL('../app/pages/post/[slug].vue', import.meta.url)), 'missing post route')
  assert.ok(existsSync(new URL('../app/pages/topics/[topic].vue', import.meta.url)), 'missing topic route')
  assert.ok(existsSync(new URL('../app/pages/topics/index.vue', import.meta.url)), 'missing topics index route')
})

test('should export shared Post types when post type module is read', () => {
  const source = readFileSync(new URL('../app/types/post.ts', import.meta.url), 'utf8')
  assert.ok(source.includes('export interface Post {'), 'missing interface Post')
  assert.ok(source.includes('export interface PostSummary'), 'missing interface PostSummary')
})
