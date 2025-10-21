import type { FastifyReply, FastifyRequest } from 'fastify'
import type { IdParams } from '~/schemas/base.schema.ts'
import { sendError, sendSuccess } from '~/utils/replyHelper.ts'

export async function getUserById(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
  const { prisma, statusCode, statusText } = request.server
  const t = request.i18n.t.bind(request.i18n)
  const id = request.params.id

  const user = await prisma.user.findUnique({
    where: { id }
  })

  if (!user)
    return sendError(reply, statusCode.NOT_FOUND, t(statusText[statusCode.NOT_FOUND]), {
      codes: { user: 'USER_NOTFOUND' },
      details: { user: t('TEXT_NOTFOUND', { color: 'User' }) }
    })

  return sendSuccess(reply, statusCode.OK, t(statusText[statusCode.OK]), user, {
    type: 'single'
  })
}
