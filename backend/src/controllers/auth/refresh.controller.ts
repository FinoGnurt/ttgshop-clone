import type { FastifyReply, FastifyRequest } from 'fastify'
import { sendError, sendSuccess } from '~/utils/replyHelper.ts'

export const refreshToken = async (req: FastifyRequest, rep: FastifyReply) => {
  const { prisma, statusCode, statusText, jwt } = req.server

  // get refresh token from cookie
  const token = req.cookies.refreshToken

  // if refresh token not exist => send error
  if (!token) return sendError(rep, statusCode.NOT_FOUND, statusText[statusCode.NOT_FOUND])

  // check refresh token exist
  const session = await prisma.session.findUnique({ where: { refreshToken: token } })

  // if refresh token (session) not exist => send error
  if (!session) return sendError(rep, statusCode.NOT_FOUND, statusText[statusCode.NOT_FOUND])

  // if refresh token expired => send error
  if (session.expiresAt < new Date()) return sendError(rep, statusCode.FORBIDDEN, statusText[statusCode.FORBIDDEN])

  // create access token
  const accessToken = jwt.sign({ userId: session.userId }, { expiresIn: process.env.ACCESS_TOKEN_TTL })

  // send success
  return sendSuccess(rep, statusCode.OK, statusText[statusCode.OK], undefined, undefined, accessToken)
}
