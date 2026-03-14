import crypto from 'crypto'
import type { FastifyRequest } from 'fastify'
import type { payload } from '~/constants/payloadJWT.ts'
import { verifyGoogleToken } from '~/modules/auth/helpers/google.helper.ts'
import { generateJwtTokens, generateRefreshTokenHash } from '~/modules/auth/helpers/jwt-token.helper.ts'
import { createSessionService } from '~/modules/auth/services/session.service.ts'
import type { SignUp } from '~/schemas/auth.schema.ts'

interface GoogleLoginBody {
  credential: string
}

export async function loginGoogleService(req: FastifyRequest<{ Body: GoogleLoginBody }>) {
  const { prisma, jwt, env } = req.server
  const { credential } = req.body

  // verify google token
  const payloadGoogle = await verifyGoogleToken(credential, env.GOOGLE_CLIENT_ID)

  // tìm user theo email
  let user = await prisma.user.findUnique({
    where: { email: payloadGoogle?.email }
  })

  // tạo user nếu chưa tồn tại
  if (!user) {
    const data: SignUp = {
      name: payloadGoogle?.name as string,
      email: payloadGoogle?.email as string,
      avatar: payloadGoogle?.picture,
      password: crypto.randomBytes(100).toString('base64')
    }

    user = await prisma.user.create({ data })
  }

  // tạo jwt payload
  const jwtPayload: payload = {
    email: user.email,
    role: user.role,
    name: user.name,
    avatar: user.avatar
  }

  // tạo access token + refresh token
  const { accessToken, refreshToken } = generateJwtTokens(jwt, jwtPayload, env, user.id)

  // hash refresh token trước khi lưu DB
  const refreshTokenHash = generateRefreshTokenHash(refreshToken)

  // tạo session (refresh token đã hash) trong db
  await createSessionService(user.id, refreshTokenHash, prisma, env)

  return { accessToken, refreshToken }
}

// loginGithubService, loginFacebookService sẽ thêm vào đây
