import { type FastifyInstance } from 'fastify'
import { authenticate, requireAdmin } from '~/middlewares/authenticate.ts'
import {
  deleteUserController,
  getUserByIdController,
  getUsersController,
  updateUserController
} from '~/modules/user/user.controller.ts'
import type { IdParams } from '~/schemas/base.schema.ts'
import * as user from '~/schemas/user.schema.ts'

export async function userRoutes(app: FastifyInstance) {
  // GET /user/:id - cần đăng nhập
  app.get<{ Params: IdParams }>('/:id', {
    schema: {
      params: { $ref: 'IdParamsSchema#' },
      response: { 200: user.GetUserSchema }
    },
    preHandler: [authenticate],
    handler: getUserByIdController
  })

  // GET /users - chỉ admin
  app.get('/', {
    schema: {
      querystring: user.queryUsersSchema,
      response: { 200: user.GetAllUserSchema }
    },
    preHandler: [authenticate, requireAdmin],
    handler: getUsersController
  })

  // DELETE /user/:id - chỉ admin
  app.delete<{ Params: IdParams }>('/:id', {
    schema: {
      params: { $ref: 'IdParamsSchema#' }
    },
    preHandler: [authenticate, requireAdmin],
    handler: deleteUserController
  })

  // PATCH /user/:id - cần đăng nhập (user tự sửa hoặc admin)
  app.patch<{ Params: IdParams; Body: user.UpdateUser }>('/:id', {
    schema: {
      params: { $ref: 'IdParamsSchema#' },
      response: { 200: user.GetUserSchema }
    },
    preHandler: [authenticate],
    handler: updateUserController
  })
}
