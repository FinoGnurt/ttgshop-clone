import chalk from 'chalk'
import type { FastifyError, FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export default function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    if (error.code === 'FST_ERR_VALIDATION') {
      // convert error message to array
      const codeErrors: string[] = error.message
        .replace(/,/g, '') // bỏ TẤT CẢ dấu phẩy trong 1 chuỗi
        .split(' ')
        .filter((item) => /^[A-Z0-9_]+$/.test(item)) // bỏ tất cả chuỗi có body trong mảng ([ 'body/email', 'EMAIL_INVALID,', 'body', 'NAME_REQUIRED,'])

      // get field errors
      const fieldErrors: string[] = codeErrors.map((errCode) => errCode.split('_')[0]?.toLowerCase() || '')

      // create error object
      error.validationErrors = {}

      // add name code and error to object
      fieldErrors.forEach((field, index): void => {
        error.validationErrors![field] = codeErrors[index] || ''
      })

      // send error
      reply.sendError(error.statusCode || 400, error.validationErrors)
    } else if (error.code === 'DB_ERR_VALIDATION') {
      reply.sendError(error.statusCode || 400, error.validationErrors)
    } else {
      // send errors without validation
      reply.status(error.statusCode || 500).send({
        status: error.statusCode || 500,
        success: false,
        message: error.message || 'Something went wrong',
        error: error.name || 'InternalServerError'
      })
    }

    // log error
    console.log(chalk.red.bold('❌ ERROR:'), chalk.red(error.message))
    request.log.error(error) // ghi lỗi vào hệ thống log của Fastify
  })
}

// FST_ERR_VALIDATION => Fastify Error Validation
// DB_ERR_VALIDATION => Database Error Validation (self-definition)

// request.i18n.t(errCode) === request.i18n.phrases[errCode]

//  "code": "VALIDATION_ERROR",
// "name": "BadRequestError",
//   error: 'Bad Request',
