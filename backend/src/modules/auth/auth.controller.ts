import type { FastifyReply, FastifyRequest } from 'fastify'
import { clearRefreshTokenCookie, setRefreshTokenCookie } from '~/modules/auth/helpers/cookie.helper.ts'
import { signInService, signOutService, signUpService } from '~/modules/auth/services/auth.service.ts'
import { loginGoogleService } from '~/modules/auth/services/oauth.service.ts'
import { refreshTokenService } from '~/modules/auth/services/session.service.ts'
import type { SignIn, SignUp } from '~/schemas/auth.schema.ts'

export async function signUp(req: FastifyRequest<{ Body: SignUp }>, rep: FastifyReply) {
  const { statusCode } = req.server

  const result = await signUpService(req)

  return rep.sendSuccess(statusCode.CREATED, 'USER_CREATED', result, { type: 'single' })
}

export async function signIn(req: FastifyRequest<{ Body: SignIn }>, rep: FastifyReply) {
  const { statusCode, statusText } = req.server

  const { accessToken, refreshToken } = await signInService(req)

  setRefreshTokenCookie(rep, refreshToken)

  return rep.sendSuccess(statusCode.OK, statusText[statusCode.OK], undefined, undefined, accessToken)
}

export async function signOut(req: FastifyRequest, rep: FastifyReply) {
  const { statusCode } = req.server
  const token = req.cookies.refreshToken

  await signOutService(req, token)

  clearRefreshTokenCookie(rep)

  return rep.sendSuccess(statusCode.NO_CONTENT)
}

export async function refreshToken(req: FastifyRequest, rep: FastifyReply) {
  const { statusCode, statusText } = req.server

  const token = req.cookies.refreshToken

  const accessToken = await refreshTokenService(req, token)

  return rep.sendSuccess(statusCode.OK, statusText[statusCode.OK], undefined, undefined, accessToken)
}

export async function loginGoogle(req: FastifyRequest<{ Body: { credential: string } }>, rep: FastifyReply) {
  const { statusCode, statusText } = req.server

  const { accessToken, refreshToken } = await loginGoogleService(req)

  setRefreshTokenCookie(rep, refreshToken)

  return rep.sendSuccess(statusCode.OK, statusText[statusCode.OK], undefined, undefined, accessToken)
}
