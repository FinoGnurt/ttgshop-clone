import crypto from 'crypto'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { OAuth2Client } from 'google-auth-library'
import type { SignUp } from '~/schemas/auth.schema.ts'
import { sendSuccess } from '~/utils/replyHelper.ts'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

interface LoginBody {
  credential: string
}

// check id token from body
export const loginGoogle = async (req: FastifyRequest<{ Body: LoginBody }>, rep: FastifyReply) => {
  const { prisma, statusCode, statusText, jwt } = req.server
  const t = req.i18n.t.bind(req.i18n)
  const { credential } = req.body

  // verify id token of google
  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID
  })

  // get payload
  const payloadGoogle = ticket.getPayload()

  // check email from db
  let result = await prisma.user.findUnique({ where: { email: payloadGoogle?.email } })

  // if email not exist => create new user
  if (!result) {
    const data: SignUp = {
      name: payloadGoogle?.name as string,
      email: payloadGoogle?.email as string,
      avatar: payloadGoogle?.picture,
      password: crypto.randomBytes(100).toString('base64')
    }

    result = await prisma.user.create({ data })
  }

  // create payload
  const payload = {
    email: result.email,
    role: result.role,
    name: result.name,
    avatar: result.avatar
  }

  // create access token
  const accessToken = jwt.sign(payload, { expiresIn: process.env.ACCESS_TOKEN_TTL, sub: result.id })

  // create refresh token
  const refreshToken = crypto.randomBytes(256).toString('base64')

  // create session to db
  await prisma.session.create({
    data: {
      userId: result.id,
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
