declare module 'fastify' {
  interface FastifyInstance {
    env: {
      PORT: number

      DATABASE_URL: string
      DATABASE_USER: string
      DATABASE_PASSWORD: string
      DATABASE_NAME: string
      DATABASE_HOST: string
      DATABASE_PORT: number

      ACCESS_TOKEN_SECRET: string
      REFRESH_TOKEN_SECRET: string
      ACCESS_TOKEN_TTL: string
      REFRESH_TOKEN_TTL: string

      GOOGLE_CLIENT_ID: string

      GITHUB_CLIENT_ID: string
      GITHUB_CLIENT_SECRET: string
      GITHUB_REDIRECT_URI: string
      SESSION_SECRET: string

      MINIO_ENDPOINT: string
      MINIO_PORT: number
      MINIO_ACCESS_KEY: string
      MINIO_SECRET_KEY: string
    }
  }
}

export {}
