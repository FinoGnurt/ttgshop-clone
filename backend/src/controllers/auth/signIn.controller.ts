import crypto from 'crypto'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { SignIn } from '~/schemas/auth.schema.ts'
import { verifyPassword } from '~/utils/bcrypt.ts'
import { sendError, sendSuccess } from '~/utils/replyHelper.ts'

export const signIn = async (req: FastifyRequest<{ Body: SignIn }>, rep: FastifyReply) => {
  const { prisma, statusCode, statusText, jwt } = req.server
  const t = req.i18n.t.bind(req.i18n)

  // get email and password from body
  const { email, password } = req.body

  // check email from db
  const user = await prisma.user.findUnique({ where: { email } })

  // check password
  const checkPassword = user ? await verifyPassword(password, user?.password as string) : false

  // if password not match => send error
  if (!user || !checkPassword) {
    return sendError(rep, statusCode.UNAUTHORIZED, t(statusText[statusCode.UNAUTHORIZED]), {
      codes: { email: 'AUTH_INVALID_CREDENTIALS' },
      details: { email: t('AUTH_INVALID_CREDENTIALS') }
    })
  }

  // create payload
  const payload = {
    email: user.email,
    role: user.role,
    name: user.name,
    avatar: user.avatar
  }

  // create access token
  const accessToken = jwt.sign(payload, { expiresIn: process.env.ACCESS_TOKEN_TTL, sub: user.id })

  // create refresh token
  const refreshToken = crypto.randomBytes(256).toString('base64')

  // save refresh token to db
  await prisma.session.create({
    data: {
      userId: user.id,
      refreshToken,
      expiresAt: new Date(Date.now() + Number(process.env.REFRESH_TOKEN_TTL))
    }
  })

  // set cookie
  rep.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: Number(process.env.REFRESH_TOKEN_TTL),
    path: '/'
  })

  // send response
  return sendSuccess(rep, statusCode.OK, statusText[statusCode.OK], undefined, undefined, accessToken)
}
