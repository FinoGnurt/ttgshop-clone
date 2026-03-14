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

// query users
enum SortOrder {
  asc = 'asc',
  desc = 'desc'
}
export const queryUsersSchema = Type.Object(
  {
    page: Type.Optional(Type.Integer({ minimum: 1, default: 1 })),
    limit: Type.Optional(Type.Integer({ minimum: 1, default: 10 })),
    sortBy: Type.Optional(Type.String({ default: 'createdAt' })),
    order: Type.Optional(Type.Enum(SortOrder, { default: SortOrder.desc })),
    status: Type.Optional(Type.Union([Type.Literal('active'), Type.Literal('inactive')])),
    isBan: Type.Optional(Type.Boolean({ default: false })),
    email: Type.Optional(Type.String()),
    name: Type.Optional(Type.String()),
    phone: Type.Optional(Type.String({ pattern: '^[0-9]{10}$' })),
    address: Type.Optional(Type.String())
  },
  {
    errorMessage: {
      properties: {
        page: 'QUERY_PAGE_INVALID',
        limit: 'QUERY_LIMIT_INVALID',
        sortBy: 'QUERY_SORT_BY_INVALID',
        order: 'QUERY_ORDER_INVALID',
        keyword: 'QUERY_KEYWORD_INVALID',
        status: 'QUERY_STATUS_INVALID',
        isBan: 'QUERY_IS_BAN_INVALID',
        email: 'QUERY_EMAIL_INVALID',
        name: 'QUERY_NAME_INVALID',
        phone: 'QUERY_PHONE_INVALID',
        address: 'QUERY_ADDRESS_INVALID'
      }
    }
  }
)
export type QueryUsers = Static<typeof queryUsersSchema>

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
