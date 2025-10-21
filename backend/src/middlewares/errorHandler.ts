import chalk from 'chalk'
import type { FastifyInstance } from 'fastify'
import { sendError } from '~/utils/replyHelper.ts'

type errorDetail = {
  [key: string]: string
}

export default function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    const { statusCode, statusText } = request.server
    if (error.validationContext) {
      const getErrCode = error.message
        .replaceAll(/,/g, '') // bỏ TẤT CẢ dấu phẩy trong 1 chuỗi
        .split(' ')
        .filter((item) => /^[A-Z0-9_]+$/.test(item)) // bỏ tất cả chuỗi có body trong mảng ([ 'body/email', 'EMAIL_INVALID,', 'body', 'NAME_REQUIRED,'])

      const nameField: string[] = getErrCode.map((errCode) => {
        return errCode.split('_')[0]?.toLowerCase() || ''
      })

      const errorCodes: errorDetail = {}
      const errorDetails: errorDetail = {}

      getErrCode.forEach((errCode, i): void => {
        const key = nameField[i]
        if (key) {
          errorCodes[key] = errCode
          errorDetails[key] = request.i18n.t(errCode)
        }
      })

      // request.i18n.t(errCode) === request.i18n.phrases[errCode]
      return sendError(reply, statusCode.BAD_REQUEST, request.i18n.t(statusText[statusCode.BAD_REQUEST]), {
        codes: errorCodes,
        details: errorDetails
      })
      //  "code": "VALIDATION_ERROR",
      // "name": "BadRequestError",
      //   error: 'Bad Request',
    } else {
      reply.status(error.statusCode || 500).send({
        statusCode: error.statusCode || 500,
        success: false,
        message: error.message || 'Something went wrong',
        error: error.name || 'InternalServerError'
      })
    }

    console.log(chalk.red.bold('❌ ERROR:'), chalk.red(error.message))
    request.log.error(error) // ghi lỗi vào hệ thống log của Fastify
  })
}
