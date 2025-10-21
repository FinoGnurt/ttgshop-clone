import { Type, type Static } from '@sinclair/typebox'
import { OmitFieldSchema, ResponseBaseSchema, UserSchema } from './base.schema.ts'

// Khi cập nhật user (optional tất cả)
export const UpdateUserSchema = Type.Partial(Type.Omit(UserSchema, ['id', 'createdAt']))
export type UpdateUser = Static<typeof UpdateUserSchema>

// Trả về user
export const GetUserSchema = ResponseBaseSchema({ dataSchema: OmitFieldSchema })
export type GetUser = Static<typeof GetUserSchema>

// Khi trả về users (array)
export const GetAllUserSchema = ResponseBaseSchema({ dataSchema: Type.Array(OmitFieldSchema) })
export type GetAllUser = Static<typeof GetAllUserSchema>

// export type ResponseUser = typeof ResponseUserSchema.static

// Note: schema dung cho route

/**
export const BaseResponseSchema = (dataSchema: TSchema) =>
  Type.Object({
    status: Type.Number(),
    success: Type.Boolean(),
    message: Type.String(),
    data: dataSchema,
    meta: Type.Optional(
      Type.Object({
        timestamp: Type.String(),
        path: Type.String(),
      })
    ),
  });
 */

/**
  export const ResponseUserSchema = Type.Intersect([
  ResponseBaseSchema,
  Type.Object({
    data: Type.Optional(UserSchema)
  })
])
   */
