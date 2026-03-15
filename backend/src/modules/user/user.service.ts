import type { FastifyRequest } from 'fastify'
import type { Prisma } from 'prisma/client'
import { buildPagination, buildUserFilter, sanitizeUpdateUserData, userSelect } from '~/modules/user/user.helper.ts'
import type { IdParams } from '~/schemas/base.schema.ts'
import type { QueryUsers, UpdateUser } from '~/schemas/user.schema.ts'

export async function getUserByIdService(request: FastifyRequest<{ Params: IdParams }>) {
  const { prisma, statusCode, throwCustomError } = request.server
  const { id } = request.params

  const user = await prisma.user.findUnique({
    where: { id },
    omit: { password: true }
  })

  if (!user) {
    throwCustomError(statusCode.NOT_FOUND, { user: 'USER_NOTFOUND' })
  }

  return user
}

export async function getUsersService(req: FastifyRequest<{ Querystring: QueryUsers }>) {
  const { prisma } = req.server
  const { page, limit, sortBy, order } = req.query

  // ---- FILTER ----
  const filter = buildUserFilter(req.query)

  // ---- SORT ----
  const sort: Prisma.UserOrderByWithRelationInput = { [sortBy as string]: order }

  // ---- PAGINATION ----
  const { skip } = buildPagination(page as number, limit as number)

  // ---- QUERY ----
  const [result, total] = await Promise.all([
    prisma.user.findMany({
      where: filter,
      orderBy: sort,
      skip,
      take: limit,
      omit: { password: true }
    }),
    prisma.user.count({ where: filter })
  ])

  return {
    data: result,
    pagination: {
      page,
      limit,
      totalPages: Math.ceil(total / (limit as number)),
      totalItems: total
    }
  }
}

export async function deleteUserService(req: FastifyRequest<{ Params: IdParams }>) {
  const { prisma, statusCode, throwCustomError } = req.server
  const { id } = req.params

  try {
    await prisma.user.delete({ where: { id } })
  } catch {
    throwCustomError(statusCode.NOT_FOUND, { user: 'USER_NOT_FOUND' })
  }
}

export async function updateUserService(req: FastifyRequest<{ Params: IdParams; Body: UpdateUser }>) {
  const { prisma, statusCode, throwCustomError } = req.server
  const { id } = req.params

  const data = sanitizeUpdateUserData(req.body)

  try {
    return await prisma.user.update({
      where: { id },
      data,
      select: userSelect
    })
  } catch {
    throwCustomError(statusCode.NOT_FOUND, { user: 'USER_NOT_FOUND' })
  }
}
