import type { FastifyReply, FastifyRequest } from 'fastify'
import type { payload } from '~/constants/payloadJWT.ts'

/**
 * Middleware xác thực access token
 *
 * Dùng làm preHandler trong route:
 *   app.get('/protected', { preHandler: [authenticate] }, handler)
 *
 * Sau khi chạy xong → req.jwtUser chứa payload đã decode
 */
export const authenticate = async (req: FastifyRequest, reply: FastifyReply) => {
  const { jwt, statusCode, throwCustomError } = req.server

  const authHeader = req.headers['authorization']

  // 1. Kiểm tra header Authorization tồn tại và đúng format Bearer
  if (!authHeader?.startsWith('Bearer ')) {
    return throwCustomError(statusCode.UNAUTHORIZED, { auth: 'MISSING_ACCESS_TOKEN' })
  }

  const token = authHeader.slice(7)

  // 2. Verify token bằng ACCESS_TOKEN_SECRET (accessJwt)
  //    Nếu hết hạn hoặc sai secret → throw lỗi
  try {
    const decoded = jwt.access.verify(token) as payload & { sub: string; iat: number; exp: number }

    // 3. Đính kèm user vào request để handler dùng
    req.jwtUser = decoded
  } catch {
    return throwCustomError(statusCode.UNAUTHORIZED, { auth: 'ACCESS_TOKEN_INVALID' })
  }
}

/**
 * Middleware kiểm tra quyền ADMIN
 * Phải dùng sau authenticate
 */
export const requireAdmin = async (req: FastifyRequest, reply: FastifyReply) => {
  const { statusCode, throwCustomError } = req.server
  const { Roles } = await import('~/constants/roles.ts')

  if (!req.jwtUser) {
    return throwCustomError(statusCode.UNAUTHORIZED, { auth: 'NOT_AUTHENTICATED' })
  }

  if (req.jwtUser.role !== Roles.ADMIN) {
    return throwCustomError(statusCode.FORBIDDEN, { auth: 'FORBIDDEN_ADMIN_REQUIRED' })
  }
}
