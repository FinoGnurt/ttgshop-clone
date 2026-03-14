import type { FastifyRequest } from 'fastify'
import type { payload } from '~/constants/payloadJWT.ts'
import { createAvatar } from '~/modules/auth/helpers/create-avatar.helper.ts'
import { generateJwtTokens, generateRefreshTokenHash } from '~/modules/auth/helpers/jwt-token.helper.ts'
import { createSessionService } from '~/modules/auth/services/session.service.ts'
import type { SignIn, SignUp } from '~/schemas/auth.schema.ts'
import { hashPassword, verifyPassword } from '~/utils/bcrypt.ts'

export async function signUpService(req: FastifyRequest<{ Body: SignUp }>) {
  const { prisma, statusCode, throwCustomError } = req.server
  const { email, password, name } = req.body

  // check email from db
  const existingUser = await prisma.user.findUnique({ where: { email } })

  // if email exist => send error
  if (existingUser) {
    throwCustomError(statusCode.BAD_REQUEST, { email: 'EMAIL_DUPLICATE' })
  }

  // create avatar from name
  const avatar = createAvatar(name)

  // create data and hash password
  const data: SignUp = {
    email,
    password: await hashPassword(password),
    name,
    avatar
  }

  // create user
  return prisma.user.create({
    data,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  })
}

export async function signInService(req: FastifyRequest<{ Body: SignIn }>) {
  const { prisma, statusCode, jwt, env, throwCustomError } = req.server
  const { email, password } = req.body

  // check email from db
  const user = await prisma.user.findUnique({ where: { email } })

  // check password
  const isPasswordValid = user ? await verifyPassword(password, user.password as string) : false

  // if password not match => send error
  if (!user || !isPasswordValid) return throwCustomError(statusCode.UNAUTHORIZED, { auth: 'AUTH_INVALID_CREDENTIALS' })

  // create payload
  const jwtPayload: payload = {
    email: user.email,
    role: user.role,
    name: user.name,
    avatar: user.avatar
  }

  // create access token + refresh token
  const { accessToken, refreshToken } = generateJwtTokens(jwt, jwtPayload, env, user.id)

  // Hash refresh token trước khi lưu DB (không lưu raw token)
  const refreshTokenHash = generateRefreshTokenHash(refreshToken)

  // create session in db
  await createSessionService(user.id, refreshTokenHash, prisma, env)

  // send response
  return { accessToken, refreshToken }
}

export async function signOutService(req: FastifyRequest, token?: string) {
  const { prisma, statusCode, statusText, throwCustomError } = req.server

  // 1. Kiểm tra refresh token có tồn tại không
  if (!token) {
    throwCustomError(statusCode.UNAUTHORIZED, { auth: 'REFRESH_TOKEN_REQUIRED' })
  }

  // 2. Hash token để tìm và xoá session trong DB
  const tokenHash = generateRefreshTokenHash(token!)

  // 3. Xoá session (revoke refresh token)
  const result = await prisma.session.deleteMany({ where: { refreshToken: tokenHash } })

  // 4. Nếu không tìm thấy session → token không hợp lệ hoặc đã logout rồi
  if (result.count === 0) {
    throwCustomError(statusCode.NOT_FOUND, { auth: statusText[statusCode.NOT_FOUND] as string })
  }

  // Note: Access token vẫn còn hiệu lực cho đến khi hết hạn (ACCESS_TOKEN_TTL)
  // Client cần tự xoá access token khỏi memory/storage
}
