import type { FastifyReply, FastifyRequest } from 'fastify'
import { sendError, sendSuccess } from '~/utils/replyHelper.ts'

export const signOut = async (req: FastifyRequest, rep: FastifyReply) => {
  const { prisma, statusCode, statusText } = req.server

  // get refresh token from cookie
  const token = req.cookies.refreshToken

  // if refresh token not exist => send error
  if (!token) return sendError(rep, statusCode.NOT_FOUND, statusText[statusCode.NOT_FOUND])

  // delete refresh token from db
  const result = await prisma.session.deleteMany({ where: { refreshToken: token } })

  // delete refresh token from cookie
  rep.clearCookie('refreshToken')

  // if refresh token not exist => send error
  if (result.count === 0) {
    return sendError(rep, statusCode.NOT_FOUND, statusText[statusCode.NOT_FOUND], {
      codes: { auth: 'dasdad' },
      details: { auth: 'dsadasd' }
    })
  }

  // send success
  return sendSuccess(rep, statusCode.NO_CONTENT)
}
