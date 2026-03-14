import type { FastifyReply } from 'fastify'
import fp from 'fastify-plugin'

export default fp(async function (fastify) {
  const statusText = fastify.statusText
  const t = fastify.i18n.t.bind(fastify.i18n)

  fastify.decorateReply(
    'sendSuccess',
    function (
      this: FastifyReply,
      statusCode: number,
      message?,
      data?: object | string[],
      meta?: {
        type?: 'single' | 'list'
        count?: number
        pagination?: { page?: number; limit?: number; totalItems?: number; totalPages?: number }
      },
      accessToken?: string
    ) {
      const response = {
        status: statusCode,
        success: true,
        message: t(message) || 'Thành công!',
        ...(data !== undefined && { data }),
        ...(meta !== undefined && { meta }),
        ...(accessToken !== undefined && { accessToken })
      }

      return this.code(statusCode).send(response)
    }
  )

  fastify.decorateReply(
    'sendError',
    function (this: FastifyReply, statusCode: number, errors?: Record<string, string>) {
      let errorsDetail: Record<string, { code: string; message: string }> | undefined

      if (errors) {
        errorsDetail = {}
        for (const field in errors) {
          errorsDetail[field] = {
            code: errors[field] || 'Unknown code',
            message: t(errors[field]) || 'Unknown error'
          }
        }
      }

      return this.code(statusCode).send({
        status: statusCode,
        success: false,
        title: t(statusText[statusCode]) || 'Error',
        ...(errorsDetail && { errors: errorsDetail })
      })
    }
  )
})
