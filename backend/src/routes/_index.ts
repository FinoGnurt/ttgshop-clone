import type { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { authRoutes } from '~/routes/auth.route.ts'
import { userRoutes } from './user.route.ts'

export default function apiRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.register(userRoutes)
  fastify.register(authRoutes, { prefix: '/auth' })
}
