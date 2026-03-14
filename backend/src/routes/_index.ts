import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { authRoutes } from '~/modules/auth/auth.routes.ts'

export default function apiRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.register(authRoutes, { prefix: '/auth' })
}
