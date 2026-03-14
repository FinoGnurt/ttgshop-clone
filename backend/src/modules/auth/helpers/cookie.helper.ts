import { type CookieSerializeOptions } from '@fastify/cookie'
import type { FastifyReply } from 'fastify'
import parseTimeToMs from '~/utils/parseTimeToMs.ts'

const REFRESH_COOKIE_OPTIONS: CookieSerializeOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none',
  path: '/'
}

export const setRefreshTokenCookie = (rep: FastifyReply, refreshToken: string) => {
  const ttl = parseTimeToMs(rep.server.env.REFRESH_TOKEN_TTL) / 1000

  // set cookie
  rep.cookie('refreshToken', refreshToken, {
    ...REFRESH_COOKIE_OPTIONS,
    maxAge: ttl
  })
}

export const clearRefreshTokenCookie = (rep: FastifyReply) => rep.clearCookie('refreshToken', REFRESH_COOKIE_OPTIONS)
