import { type FastifyInstance } from 'fastify'
import { refreshToken, signIn, signOut, signUp } from '~/controllers/index.ts'
import * as auth from '~/schemas/auth.schema.ts'

export async function authRoutes(app: FastifyInstance) {
  // createUser: POST /auth/signup
  app.post<{ Body: auth.SignUp; Reply: auth.ResSignUp }>('/signup', {
    schema: {
      body: auth.SignUpSchema,
      response: { [app.statusCode.CREATED]: auth.ResSignUpSchema }
    },
    handler: signUp
  })

  // login: POST /auth/signin
  app.post<{ Body: auth.SignIn; Reply: auth.ResAccessToken }>('/signin', {
    schema: {
      body: auth.SignInSchema,
      response: { [app.statusCode.OK]: auth.ResAccessTokenSchema }
    },
    handler: signIn
  })

  // logout: POST /auth/signout
  app.post('/signout', signOut)

  // refresh: POST /auth/refresh
  app.post('/refresh', refreshToken)
}
