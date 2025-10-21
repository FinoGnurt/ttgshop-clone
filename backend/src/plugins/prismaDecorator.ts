import fp from 'fastify-plugin'
import prisma from '~/config/db.ts'

export default fp(async (fastify) => {
  // Gắn prisma vào Fastify instance
  fastify.decorate('prisma', prisma)

  // Khi server đóng, ngắt kết nối Prisma
  fastify.addHook('onClose', async (app) => {
    await app.prisma.$disconnect()
  })
})
