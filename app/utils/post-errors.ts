export const NOT_FOUND_ERRORS = {
  post: { statusCode: 404, statusMessage: 'Post not found' },
  topic: { statusCode: 404, statusMessage: 'Topic not found' },
} as const

export type NotFoundError = {
  statusCode: number
  statusMessage: string
  fatal?: boolean
}

export function assertFound<T>(value: T | null | undefined, notFound: NotFoundError = NOT_FOUND_ERRORS.post): asserts value is T {
  if (!value) throw createError(notFound)
}
