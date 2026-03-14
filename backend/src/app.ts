import cookie from '@fastify/cookie'
import fastifyEnv from '@fastify/env'
import formbody from '@fastify/formbody'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import type { Plugin } from 'ajv'
import ajvErrors from 'ajv-errors'
import dotenv from 'dotenv'
import fastify from 'fastify'
import i18n from 'fastify-i18n'

// import file
import envOptions from '~/config/env.config.ts'
import errorHandler from '~/middlewares/errorHandler.ts'
import errorPlugin from '~/plugins/decorators/error.plugin.ts'
import minioPlugin from '~/plugins/decorators/minio.plugin.ts'
import prismaPlugin from '~/plugins/decorators/prisma.plugin.ts'
import replyPlugin from '~/plugins/decorators/reply.plugin.ts'
import statusPlugin from '~/plugins/decorators/status.plugin.ts'
import addMetaResponse from '~/plugins/hooks/metadata.plugin.ts'
import apiRoutes from '~/routes/_index.ts'
import { arrAllSchema } from '~/schemas/base.schema.ts'
import loadLocale from '~/utils/loadFileLocale.ts'

dotenv.config({ path: '.env' })

export const buildApp = async () => {
  const app = fastify({
    logger: false,
    ajv: {
      customOptions: {
        allErrors: true,
        strict: false,
        $data: true,
        messages: true
      },
      plugins: [ajvErrors as unknown as Plugin<unknown>]
    }
  })

  // ========================
  // 1. Load environment
  // ========================
  await app.register(fastifyEnv, envOptions)
  await app.after() // đảm bảo app.env đã sẵn sàng

  // ========================
  // 2. Register plugins
  // ========================
  app.register(multipart)
  app.register(formbody)
  app.register(prismaPlugin)
  app.register(i18n, {
    fallbackLocale: 'vi',
    messages: {
      vi: loadLocale('vi'),
      en: loadLocale('en')
    }
  })
  app.register(statusPlugin)
  app.register(jwt, { secret: app.env.ACCESS_TOKEN_SECRET, namespace: 'access' })
  app.register(jwt, { secret: app.env.REFRESH_TOKEN_SECRET, namespace: 'refresh' })
  app.register(cookie)
  app.register(replyPlugin)
  app.register(minioPlugin)
  app.register(errorPlugin)

  // ========================
  // 3. Hooks
  // ========================
  addMetaResponse(app)

  // ========================
  // 4. Routes
  // ========================
  app.get('/', async (req, rep) => {
    rep.hijack()
    rep.raw.writeHead(200, { 'Content-Type': 'text/plain' })
    rep.raw.end('Welcome to TTGShop API from Fastify!')
  })

  app.get('/sse', (req, reply) => {
    reply.raw.setHeader('Content-Type', 'text/event-stream')
    reply.raw.setHeader('Cache-Control', 'no-cache')
    reply.raw.setHeader('Connection', 'keep-alive')
    reply.hijack()

    const stream = reply.raw
    const interval = setInterval(() => {
      stream.write(`data: ${Date.now()}\n\n`)
    }, 1000)

    req.raw.on('close', () => {
      clearInterval(interval)
    })
  })

  app.register(apiRoutes, { prefix: '/api' })

  // ========================
  // 5. Error handler
  // ========================
  errorHandler(app)

  // ========================
  // 6. Add schemas
  // ========================
  arrAllSchema.forEach((schema) => app.addSchema(schema))

  return app
}
