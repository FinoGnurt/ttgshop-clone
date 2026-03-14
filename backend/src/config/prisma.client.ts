import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import type { FastifyInstance } from 'fastify'
import { PrismaClient } from 'prisma/client'

export default function prismaClient(env: FastifyInstance['env']) {
  const adapter = new PrismaMariaDb({
    host: env.DATABASE_HOST, // your database host
    user: env.DATABASE_USER, // your database username
    password: env.DATABASE_PASSWORD, // your database password
    database: env.DATABASE_NAME, // optional, your database name
    port: env.DATABASE_PORT, // optional, your database port
    connectionLimit: 5
  })

  return new PrismaClient({ adapter })
}
