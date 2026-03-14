import fp from 'fastify-plugin'
import createPrismaClient from '~/config/prisma.client.ts'

export default fp(async (fastify) => {
  // Tạo prisma client
  const prisma = createPrismaClient(fastify.env)

  // Gắn prisma vào Fastify instance
  fastify.decorate('prisma', prisma)

  // Khi server đóng, ngắt kết nối Prisma
  fastify.addHook('onClose', async (app) => {
    await app.prisma.$disconnect()
  })
})
