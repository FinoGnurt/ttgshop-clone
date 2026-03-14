import type { FastifyInstance } from 'fastify'
import { Client } from 'minio'

export default function createMinioClient(env: FastifyInstance['env']) {
  const minioClient = new Client({
    endPoint: env.MINIO_ENDPOINT,
    port: env.MINIO_PORT,
    useSSL: false, // HTTPS
    accessKey: env.MINIO_ACCESS_KEY,
    secretKey: env.MINIO_SECRET_KEY
  })

  return minioClient
}
