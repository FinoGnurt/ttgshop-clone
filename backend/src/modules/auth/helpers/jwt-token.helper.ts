import crypto from 'crypto'
import type { FastifyInstance } from 'fastify'
import type { payload } from '~/constants/payloadJWT.ts'

/**
 * Tạo access token bằng ACCESS_TOKEN_SECRET (namespace: accessJwt)
 */
const createAccessToken = (
  jwt: FastifyInstance['jwt'],
  payload: payload,
  env: FastifyInstance['env'],
  userId: string
) => {
  return jwt.access.sign(payload, { expiresIn: env.ACCESS_TOKEN_TTL, sub: userId })
}

/**
 * Tạo refresh token bằng REFRESH_TOKEN_SECRET (namespace: refreshJwt)
 */
const createRefreshToken = (
  jwt: FastifyInstance['jwt'],
  payload: payload,
  env: FastifyInstance['env'],
  userId: string
) => {
  return jwt.refresh.sign(payload, { expiresIn: env.REFRESH_TOKEN_TTL, sub: userId })
}

/**
 * Tạo cặp access + refresh token cùng lúc
 */
const generateJwtTokens = (
  jwt: FastifyInstance['jwt'],
  payload: payload,
  env: FastifyInstance['env'],
  userId: string
) => {
  const accessToken = createAccessToken(jwt, payload, env, userId)
  const refreshToken = createRefreshToken(jwt, payload, env, userId)
  return { accessToken, refreshToken }
}

/**
 * Verify access token bằng ACCESS_TOKEN_SECRET
 */
const verifyAccessToken = (jwt: FastifyInstance['jwt'], accessToken: string) => {
  return jwt.access.verify(accessToken)
}

/**
 * Verify refresh token bằng REFRESH_TOKEN_SECRET
 * ✅ QUAN TRỌNG: không dùng accessJwt để verify refresh token
 */
const verifyRefreshToken = (jwt: FastifyInstance['jwt'], refreshToken: string) => {
  return jwt.refresh.verify(refreshToken)
}

/**
 * Hash refresh token (SHA-256) trước khi lưu vào DB
 * Mục đích: bảo vệ trong trường hợp DB bị lộ
 */
const generateRefreshTokenHash = (refreshToken: string) => {
  return crypto.createHash('sha256').update(refreshToken).digest('hex')
}

export {
  createAccessToken,
  createRefreshToken,
  generateJwtTokens,
  generateRefreshTokenHash,
  verifyAccessToken,
  verifyRefreshToken
}
