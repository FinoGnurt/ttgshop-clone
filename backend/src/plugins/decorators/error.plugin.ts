import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import { CustomError } from '~/utils/customError.ts'

export default fp(async function errorPlugin(fastify: FastifyInstance) {
  // Thêm helper tạo lỗi
  fastify.decorate('CustomError', CustomError)

  // Hoặc thêm hàm tiện lợi để ném lỗi
  fastify.decorate('throwCustomError', (statusCode: number, input?: Record<string, string>) => {
    throw new CustomError(statusCode, input)
  })
})
