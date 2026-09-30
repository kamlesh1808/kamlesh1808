import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { NOT_FOUND_ERRORS, assertFound } from '../app/utils/post-errors.ts'

(globalThis as any).createError = (input: any) => { const err: any = new Error(input?.statusMessage ?? 'error'); err.statusCode = input?.statusCode; err.statusMessage = input?.statusMessage; if (input?.fatal !== undefined) err.fatal = input.fatal; return err }

test('should expose post and topic 404s when NOT_FOUND_ERRORS is read', () => {
  assert.deepEqual(NOT_FOUND_ERRORS.post, { statusCode: 404, statusMessage: 'Post not found' })
  assert.deepEqual(NOT_FOUND_ERRORS.topic, { statusCode: 404, statusMessage: 'Topic not found' })
})

test('should return void without throwing when assertFound receives truthy values', () => {
  assert.doesNotThrow(() => assertFound({ id: 1 }))
  assert.doesNotThrow(() => assertFound('hello'))
  assert.doesNotThrow(() => assertFound(1))
  assert.equal(assertFound({ id: 1 }), undefined)
})

test('should throw the default post 404 when assertFound receives nullish or empty values', () => {
  const missing: unknown[] = [null, undefined, '']
  for (const value of missing) {
    try {
      assertFound(value as string)
      assert.fail(`expected assertFound to throw for ${String(value)}`)
    } catch (err) {
      const thrown = err as any
      assert.equal(thrown.statusCode, 404)
      assert.equal(thrown.statusMessage, 'Post not found')
    }
  }
})

test('should pass through a custom fatal topic error when assertFound receives a custom error', () => {
  try {
    assertFound(null as unknown as string, { ...NOT_FOUND_ERRORS.topic, fatal: true })
    assert.fail('expected assertFound to throw custom error')
  } catch (err) {
    const thrown = err as any
    assert.equal(thrown.statusCode, 404)
    assert.equal(thrown.statusMessage, 'Topic not found')
    assert.equal(thrown.fatal, true)
  }
})

test('should stay client-safe when post-errors source is scanned for server-only markers', () => {
  const source = readFileSync(new URL('../app/utils/post-errors.ts', import.meta.url), 'utf8')
  const markers = ['node:', 'process.', 'markdown-it', "from 'node", 'fs', 'join(']
  for (const marker of markers) {
    assert.ok(!source.includes(marker), `client-unsafe marker found: ${marker}`)
  }
})
