import type { FastifyReply, FastifyRequest } from 'fastify'
import { sendSuccess } from '~/utils/replyHelper.ts'

export async function getUsers(req: FastifyRequest, reply: FastifyReply) {
  const { prisma, statusCode, statusText } = req.server

  // get all users
  const result = await prisma.user.findMany({
    omit: { password: true }
  })

  // count all users
  const count = await prisma.user.count()

  // send success
  return sendSuccess(reply, statusCode.OK, req.i18n.t(statusText[statusCode.OK]), result, { type: 'list', count })
}
