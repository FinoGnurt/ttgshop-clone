import cookie from '@fastify/cookie'
import formbody from '@fastify/formbody'
import jwt from '@fastify/jwt'
import fastifyMultipart from '@fastify/multipart'
import addErrors from 'ajv-errors'
import fastify from 'fastify'
import i18n from 'fastify-i18n'

// import file
import { cleanExpiredSessions } from '~/cron/cleanExpiredSessions.ts'
import errorHandler from '~/middlewares/errorHandler.ts'
import { addMetaResHook } from '~/plugins/addMetaResHook.ts'
import prismaPlugin from '~/plugins/prismaDecorator.ts'
import statusPlugin from '~/plugins/statusDecorator.ts'
import apiRoutes from '~/routes/_index.ts'
import { arrAllSchema } from '~/schemas/base.schema.ts'
import loadLocale from '~/utils/loadFileLocale.ts'

// options fastify
const app = fastify({
  logger: false, // bật log
  ajv: {
    customOptions: {
      allErrors: true, // cần thiết để hiển thị nhiều lỗi cùng lúc
      strict: false,
      $data: true, // hỗ trợ custom keyword (nếu cần)
      messages: true
    },
    plugins: [addErrors.default]
  }
})

export const buildApp = () => {
  // Plugins
  app.register(fastifyMultipart)
  //   app.register(cors, { origin: "*" }); app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
  app.register(prismaPlugin)
  app.register(i18n, {
    fallbackLocale: 'vi',
    messages: {
      vi: loadLocale('vi'),
      en: loadLocale('en')
    }
  })
  app.register(statusPlugin)
  app.register(formbody) //urlencoded
  app.register(jwt, { secret: process.env.ACCESS_TOKEN_SECRET as string })
  app.register(cookie)

  addMetaResHook(app)

  // Routes
  app.register(apiRoutes, { prefix: '/api' })

  // middlewares
  errorHandler(app)

  cleanExpiredSessions(app)

  // add schema to server fastify
  arrAllSchema.forEach((schema) => app.addSchema(schema))

  return app
}
