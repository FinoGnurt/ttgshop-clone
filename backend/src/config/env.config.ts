import type { FastifyEnvOptions } from '@fastify/env'
import { Type } from '@sinclair/typebox'

const envOptions: FastifyEnvOptions = {
  confKey: 'env',
  dotenv: true,
  schema: {
    type: 'object',
    required: ['DATABASE_URL'],
    properties: {
      PORT: Type.Number({ default: 8080 }),

      DATABASE_URL: Type.String(),
      DATABASE_USER: Type.String(),
      DATABASE_PASSWORD: Type.String(),
      DATABASE_NAME: Type.String(),
      DATABASE_HOST: Type.String(),
      DATABASE_PORT: Type.Number(),

      ACCESS_TOKEN_SECRET: Type.String(),
      REFRESH_TOKEN_SECRET: Type.String(),
      ACCESS_TOKEN_TTL: Type.String({ default: '30m' }),
      REFRESH_TOKEN_TTL: Type.String({ default: '14d' }),

      GOOGLE_CLIENT_ID: Type.String(),

      GITHUB_CLIENT_ID: Type.String(),
      GITHUB_CLIENT_SECRET: Type.String(),
      GITHUB_REDIRECT_URI: Type.String(),
      SESSION_SECRET: Type.String(),

      MINIO_ENDPOINT: Type.String({ default: 'localhost' }),
      MINIO_PORT: Type.Number({ default: 9000 }),
      MINIO_ACCESS_KEY: Type.String({ default: 'minioadmin' }),
      MINIO_SECRET_KEY: Type.String({ default: 'minioadmin' })

      // GOOGLE_CLIENT_ID: Type.String(),
      // GOOGLE_CLIENT_SECRET: Type.String(),
      // GOOGLE_REDIRECT_URI: Type.String(),
      // GOOGLE_CALLBACK_URI: Type.String(),
      // GOOGLE_API_KEY: Type.String()
    }
  }
}

export default envOptions
