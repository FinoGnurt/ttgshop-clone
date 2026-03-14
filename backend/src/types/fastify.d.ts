import '@fastify/jwt'
import 'fastify'
import type { Client as MinioClient } from 'minio'
import type { PrismaClient } from 'prisma/client'
import type { payload } from '~/constants/payloadJWT.ts'
import type { CustomError } from '~/utils/customError.ts'

/**
 * Augment @fastify/jwt để TypeScript nhận biết các namespace JWT:
 *   - fastify.jwt.access  (ACCESS_TOKEN_SECRET)
 *   - fastify.jwt.refresh (REFRESH_TOKEN_SECRET)
 */
declare module '@fastify/jwt' {
  interface JWT {
    access: JWT
    refresh: JWT
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient

    statusCode: typeof import('~/constants/statusCode.ts').STATUS_CODE
    statusText: typeof import('~/constants/statusText.ts').STATUS_TEXT

    minio: MinioClient

    CustomError: typeof CustomError
    /**
     * @example new CustomError(400, { email: "INVALID_EMAIL" });
     * @example new CustomError(500);
     */
    throwCustomError(statusCode: number, input?: Record<string, string>): never
  }

  interface FastifyRequest {
    startTime: number // Thời gian bắt đầu request (metadata.plugin.ts)

    /**
     * Được set bởi authenticate middleware sau khi verify access token thành công
     * Chứa payload của access token (email, role, name, avatar, sub, iat, exp)
     */
    jwtUser?: payload & { sub: string; iat: number; exp: number }
  }

  interface FastifyReply {
    /**
     * @example
     * sendSuccess(200, 'USER_CREATED', { ...data }, { type: 'single' });
     * @example
     * sendSuccess(201, 'USER_CREATED');
     */
    sendSuccess(
      statusCode: number,
      message?: string,
      data?: object | string[],
      meta?: {
        type?: 'single' | 'list'
        count?: number
        pagination?: { page?: number; limit?: number; totalItems?: number; totalPages?: number }
      },
      accessToken?: string
    ): FastifyReply

    /**
     * @example
     * sendError(400, { email: 'EMAIL_INVALID', password: 'PASSWORD_INVALID' });
     * @example
     * sendError(500);
     */
    sendError(statusCode: number, error?: Record<string, string>): FastifyReply
  }

  interface FastifyError {
    validationErrors?: Record<string, string>
  }
}

export {} // Nếu không có export {} → TS coi file là global script, không merge module đúng cách → phá vỡ type gốc.
