import type { FastifyInstance, FastifyRequest } from 'fastify'
import type { payload } from '~/constants/payloadJWT.ts'
import {
  createAccessToken,
  generateRefreshTokenHash,
  verifyRefreshToken
} from '~/modules/auth/helpers/jwt-token.helper.ts'
import parseTimeToMs from '~/utils/parseTimeToMs.ts'

// tạo session
export async function createSessionService(
  userId: string,
  refreshToken: string,
  prisma: FastifyInstance['prisma'],
  env: FastifyInstance['env']
) {
  //===================== login 1 session =================
  // delete refresh token from db
  await prisma.session.deleteMany({ where: { userId } })

  // save refresh token to db
  await prisma.session.create({
    data: {
      userId,
      refreshToken,
      expiresAt: new Date(Date.now() + parseTimeToMs(env.REFRESH_TOKEN_TTL))
    }
  })
}

// kiểm tra refresh token và cấp lại access token khi hết hạn
export async function refreshTokenService(req: FastifyRequest, token?: string) {
  const { prisma, statusCode, jwt, env, throwCustomError } = req.server

  // kiểm tra refresh token có được gửi lên không
  if (!token) throwCustomError(statusCode.UNAUTHORIZED, { auth: 'REFRESH_TOKEN_REQUIRED' })

  // verify refresh token bằng REFRESH_TOKEN_SECRET (refreshJwt)
  let decoded: payload & { sub?: string }
  try {
    decoded = verifyRefreshToken(jwt, token!) as payload & { sub?: string }
  } catch {
    return throwCustomError(statusCode.UNAUTHORIZED, { auth: 'REFRESH_TOKEN_INVALID' })
  }

  // hash token gửi lên để tìm trong DB (DB lưu hash, không lưu raw)
  const tokenHash = generateRefreshTokenHash(token!)

  // tìm session trong DB theo hash
  const session = await prisma.session.findUnique({
    where: { refreshToken: tokenHash }
  })

  // nếu session không tồn tại → token đã bị revoke hoặc chưa login
  if (!session) throwCustomError(statusCode.UNAUTHORIZED, { auth: 'REFRESH_TOKEN_REVOKED' })

  // kiểm tra session hết hạn (double-check ngoài JWT exp)
  if (session!.expiresAt < new Date()) {
    await prisma.session.deleteMany({ where: { userId: session!.userId } })
    throwCustomError(statusCode.FORBIDDEN, { auth: 'REFRESH_TOKEN_EXPIRED' })
  }

  // lấy userId từ payload (sub được set lúc sign)
  const userId = decoded.sub || session!.userId

  // tạo access token mới bằng ACCESS_TOKEN_SECRET
  const jwtPayload: payload = {
    email: decoded.email,
    role: decoded.role,
    name: decoded.name,
    avatar: decoded.avatar
  }

  return createAccessToken(jwt, jwtPayload, env, userId)
}
