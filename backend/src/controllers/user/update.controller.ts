import type { FastifyReply, FastifyRequest } from 'fastify'
import type { IdParams } from '~/schemas/base.schema.ts'
import type { UpdateUser } from '~/schemas/user.schema.ts'
import { sendError, sendSuccess } from '~/utils/replyHelper.ts'

export const updateUser = async (req: FastifyRequest<{ Params: IdParams; Body: UpdateUser }>, reply: FastifyReply) => {
  const { prisma, statusCode, statusText } = req.server
  const t = req.i18n.t.bind(req.i18n)
  const id = req.params.id

  // if()
  const { email, password, role, updatedAt, ...data } = req.body

  const checkId = await prisma.user.findUnique({ where: { id } })
  if (!checkId)
    return sendError(reply, statusCode.NOT_FOUND, t(statusText[statusCode.NOT_FOUND]), {
      codes: { user: 'USER_NOTFOUND' },
      details: { user: t('USER_NOTFOUND') }
    })

  const result = await prisma.user.update({
    where: { id },
    data: { ...data, updatedAt: new Date() },
    select: {
      id: true,
      email: true,
      password: false,
      name: true,
      phone: true,
      address: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  })

  return sendSuccess(reply, statusCode.OK, t(statusText[statusCode.OK]), result, { type: 'single' })
}
