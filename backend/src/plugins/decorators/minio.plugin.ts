import type { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import createMinioClient from '~/config/minio.client.ts'

const minioPlugin: FastifyPluginAsync = async (fastify) => {
  // Tạo minio client
  const minioClient = createMinioClient(fastify.env)

  // Gắn minio vào Fastify instance
  fastify.decorate('minio', minioClient)
}

export default fp(minioPlugin)
