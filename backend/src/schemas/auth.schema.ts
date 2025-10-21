import { Type, type Static } from '@sinclair/typebox'
import { OmitFieldSchema, ResponseBaseSchema, UserSchema } from '~/schemas/base.schema.ts'

// Khi tạo user lấy 'email', 'password', 'name'
export const SignUpSchema = Type.Pick(UserSchema, ['email', 'password', 'name', 'avatar'])
export type SignUp = Static<typeof SignUpSchema>

// Trả về user nhưng chỉ lấy 'email', 'password', 'role', 'arrAvatar', 'createdAt', 'updatedAt'
export const ResSignUpSchema = ResponseBaseSchema({ dataSchema: Type.Partial(OmitFieldSchema) })
export type ResSignUp = Static<typeof ResSignUpSchema>

// Khi đăng nhập lấy 'email', 'password'
export const SignInSchema = Type.Pick(UserSchema, ['email', 'password'])
export type SignIn = Static<typeof SignInSchema>

// lấy refreshToken
export const RefreshTokenSchema = Type.Object({ refreshToken: Type.String() })
export type RefreshToken = Static<typeof RefreshTokenSchema>

// Chỉ trả về accessToken
export const ResAccessTokenSchema = ResponseBaseSchema({ accessTokenSchema: Type.String() })
export type ResAccessToken = Static<typeof ResAccessTokenSchema>

// export const CreateUserSchema = Type.Pick(UserSchema, ['email', 'password', 'name'], {
//   additionalProperties: false,
//   errorMessage: {
//     additionalProperties: 'Trường không hợp lệ.',
//     required: {
//       name: 'NAME_REQUIRED',
//       email: 'EMAIL_REQUIRED',
//       password: 'PASSWORD_REQUIRED'
//     },
//     properties: {
//       name: 'NAME_INVALID',
//       password: 'PASSWORD_INVALID'
//     },
//     _: 'INVALID_PAYLOAD'
//   }
// })
