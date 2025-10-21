import type { FastifyReply } from 'fastify'

type objectMeta = {
  type?: 'single' | 'list'
  count?: number
  pagination?: { page?: number; limit?: number; totalItems?: number; totalPages?: number }
}

// src/utils/reply.ts
export function sendSuccess(
  reply: FastifyReply,
  statusCode: number,
  message = 'Thành công!',
  data?: object | string[],
  meta?: objectMeta,
  accessToken?: string
) {
  const response: Record<string, any> = {
    status: statusCode,
    success: true,
    message
  }

  if (accessToken !== undefined) response.accessToken = accessToken
  if (data !== undefined) response.data = data
  if (meta !== undefined) response.meta = meta

  return reply.code(statusCode).send(response)
}

export function sendError(
  reply: FastifyReply,
  statusCode: number,
  message: string = 'Thất bại!',
  error?: { codes: object; details: object }
) {
  const response: Record<string, any> = {
    status: statusCode,
    success: false,
    message: message
  }

  if (error !== undefined) response.error = error

  return reply.code(statusCode).send(response)
}
