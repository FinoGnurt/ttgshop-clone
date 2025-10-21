import { PrismaClient } from '@prisma/client'

// Khai báo mở rộng kiểu của FastifyInstance để có thể truy cập prisma
declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient

    statusCode: typeof import('~/constants/statusCode.ts').STATUS_CODE
    statusText: typeof import('~/constants/statusText.ts').STATUS_TEXT
  }

  interface FastifyRequest {
    startTime: number
  }
}
