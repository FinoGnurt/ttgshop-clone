import type { FastifyReply, FastifyRequest } from 'fastify'
import type { IdParams } from '~/schemas/base.schema.ts'
import { sendError, sendSuccess } from '~/utils/replyHelper.ts'

export const deleteUser = async (req: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
  const { prisma, statusCode, statusText } = req.server
  const t = req.i18n.t.bind(req.i18n)
  const id = req.params.id

  // check id
  const checkId = await prisma.user.findUnique({ where: { id } })

  // if id not exist => send error
  if (!checkId)
    return sendError(reply, statusCode.NOT_FOUND, t(statusText[statusCode.NOT_FOUND]), {
      codes: { user: 'USER_NOTFOUND' },
      details: { user: t('TEXT_NOTFOUND', { text: 'User' }) }
    })

  // delete user
  await prisma.user.delete({ where: { id } })

  // send success
  return sendSuccess(reply, statusCode.NO_CONTENT)
}
