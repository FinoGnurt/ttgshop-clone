import { Type, type Static, type TSchema } from '@sinclair/typebox'
import { Roles } from '~/constants/roles.ts'

/**
 * Schema cho request body (POST/PUT)
 */

// Schema for params with id
const IdParamsSchema = Type.Object(
  {
    id: Type.String({
      minLength: 1,
      errorMessage: {
        minLength: 'ID_REQUIRED'
      }
    })
  },
  { $id: 'IdParamsSchema' }
)
export type IdParams = Static<typeof IdParamsSchema>
export const arrAllSchema: object[] = [IdParamsSchema] // addSchema to server

// schema for array avatar of user
const ArrAvatarSchema = Type.Object({
  id: Type.String(),
  userId: Type.String(),
  image: Type.Optional(Type.String({ description: 'Base64 encoded image or URL' })),
  createdAt: Type.String({ format: 'date-time' })
})

// Schema for user
export const UserSchema = Type.Object(
  {
    id: Type.String(),
    email: Type.String({ format: 'email' }),
    password: Type.String({ pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$' }),
    name: Type.String({ errorMessage: { format: 'EMAIL_INVALID' } }),
    phone: Type.Optional(Type.Union([Type.String({ pattern: '^[0-9]{10}$' }), Type.Null()])),
    address: Type.Optional(Type.Union([Type.String(), Type.Null()])),
    avatar: Type.Optional(Type.String()),
    arrAvatar: Type.Optional(Type.Array(ArrAvatarSchema)),
    role: Type.Enum(Roles, { default: Roles.USER }),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' })
  },
  {
    additionalProperties: false,
    errorMessage: {
      additionalProperties: 'Trường không hợp lệ.',
      required: {
        name: 'NAME_REQUIRED',
        email: 'EMAIL_REQUIRED',
        password: 'PASSWORD_REQUIRED'
      },
      properties: {
        name: 'NAME_INVALID',
        email: 'EMAIL_INVALID',
        password: 'PASSWORD_INVALID'
      },
      _: 'INVALID_PAYLOAD'
    }
  }
)
export const OmitFieldSchema = Type.Omit(UserSchema, ['password']) // remove password from response

// schema base for response
interface ResponseSchemaParams {
  accessTokenSchema?: TSchema
  dataSchema?: TSchema
  errorSchema?: TSchema
}
export const ResponseBaseSchema = ({
  accessTokenSchema = Type.String(),
  dataSchema = Type.Object({}),
  errorSchema = Type.Object({
    codes: Type.Record(Type.String(), Type.String()),
    details: Type.Record(Type.String(), Type.String())
  })
}: ResponseSchemaParams) =>
  Type.Object(
    {
      status: Type.Number({ description: 'HTTP status code' }),
      success: Type.Boolean({ description: 'Trạng thái thành công hay thất bại' }),
      message: Type.String({ description: 'Thông báo kết quả' }),
      accessToken: Type.Optional(accessTokenSchema),
      data: Type.Optional(Type.Union([dataSchema, Type.Array(dataSchema)])),
      error: Type.Optional(errorSchema),
      // metadata for response
      meta: Type.Optional(
        Type.Object({
          type: Type.Optional(Type.Union([Type.Literal('single'), Type.Literal('list')])),
          count: Type.Optional(Type.Number()),
          timestamp: Type.Optional(Type.String({ format: 'date-time' })),
          path: Type.Optional(Type.String()),
          duration: Type.Optional(Type.Number({ description: 'Thời gian xử lý (ms)' })),
          pagination: Type.Optional(
            Type.Object({
              page: Type.Number(),
              limit: Type.Number(),
              totalItems: Type.Number(),
              totalPages: Type.Number()
            })
          )
        })
      )
    },
    { additionalProperties: false }
  )

/**
      data: Type.Optional(
        Type.Array(Type.Record(Type.String(), Type.Union([Type.String(), Type.Number()])), {
          description: 'Dữ liệu trả về dạng mảng các object có key-value là string hoặc number'
        })
      ),
   */
