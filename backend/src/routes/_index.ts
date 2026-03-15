import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { authRoutes } from '~/modules/auth/auth.routes.ts'
import { userRoutes } from '~/modules/user/user.route.ts'

export default function apiRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.register(authRoutes, { prefix: '/auth' })
  fastify.register(userRoutes, { prefix: '/users' })
}
