import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  deleteUserService,
  getUserByIdService,
  getUsersService,
  updateUserService
} from '~/modules/user/user.service.ts'
import type { IdParams } from '~/schemas/base.schema.ts'
import type { QueryUsers, UpdateUser } from '~/schemas/user.schema.ts'

export async function getUserByIdController(request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
  const { statusCode, statusText } = request.server

  const user = await getUserByIdService(request)

  return reply.sendSuccess(statusCode.OK, statusText[statusCode.OK], user!, {
    type: 'single'
  })
}

export async function getUsersController(req: FastifyRequest<{ Querystring: QueryUsers }>, reply: FastifyReply) {
  const { statusCode, statusText } = req.server
  const result = await getUsersService(req)

  return reply.sendSuccess(statusCode.OK, statusText[statusCode.OK], result.data, {
    type: 'list',
    pagination: result.pagination
  })
}

export async function deleteUserController(req: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) {
  const { statusCode } = req.server

  await deleteUserService(req)

  return reply.sendSuccess(statusCode.NO_CONTENT)
}

export async function updateUserController(
  req: FastifyRequest<{ Params: IdParams; Body: UpdateUser }>,
  reply: FastifyReply
) {
  const { statusCode, statusText } = req.server

  const result = await updateUserService(req)

  return reply.sendSuccess(statusCode.OK, statusText[statusCode.OK], result, {
    type: 'single'
  })
}
