import { type FastifyInstance } from 'fastify'
import { deleteUser, getUserById, getUsers, updateUser } from '~/controllers/index.ts'
import type { IdParams } from '~/schemas/base.schema.ts'
import * as s from '~/schemas/user.schema.ts'

export async function userRoutes(app: FastifyInstance) {
  // GET /user/:id
  app.get<{ Params: IdParams }>('/user/:id', {
    schema: {
      params: { $ref: 'IdParamsSchema#' },
      response: { 200: s.GetUserSchema }
    },
    handler: getUserById
  })

  // GET /user
  app.get('/users', {
    schema: {
      response: { 200: s.GetAllUserSchema }
    },
    handler: getUsers
  })

  app.delete<{ Params: IdParams }>('/user/:id', {
    schema: {
      params: { $ref: 'IdParamsSchema#' }
    },
    handler: deleteUser
  })

  app.patch<{ Params: IdParams; Body: s.UpdateUser }>('/user/:id', {
    schema: {
      params: { $ref: 'IdParamsSchema#' },
      response: { 200: s.GetUserSchema }
    },
    handler: updateUser
  })
}
