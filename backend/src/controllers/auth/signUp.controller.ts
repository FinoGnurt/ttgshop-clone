import type { FastifyReply, FastifyRequest } from 'fastify'
import type { SignUp } from '~/schemas/auth.schema.ts'
import { OmitFieldSchema } from '~/schemas/base.schema.ts'
import { hashPassword } from '~/utils/bcrypt.ts'
import { sendError, sendSuccess } from '~/utils/replyHelper.ts'

export async function signUp(request: FastifyRequest<{ Body: SignUp }>, reply: FastifyReply) {
  const { prisma, statusCode, statusText } = request.server
  const { email, password, name } = request.body
  const t = request.i18n.t.bind(request.i18n)
  console.log('first')

  // check email from db
  const checkEmail = await prisma.user.findUnique({ where: { email } })

  // if email exist => send error
  if (checkEmail) {
    return sendError(
      reply,
      statusCode.CONFLICT,
      t(statusText[statusCode.CONFLICT]),
      { codes: { email: 'EMAIL_DUPLICATE' }, details: { email: t('EMAIL_DUPLICATE') } }
      // 'Email đã được sử dụng bởi tài khoản khác.'
    )
  }

  // create avatar from name
  const parseName = name.replaceAll(' ', '+')
  const avatar = `https://ui-avatars.com/api/?name=${parseName}&background=random&bold=true`

  // create data and hash password
  const data: SignUp = {
    email,
    password: await hashPassword(password),
    name,
    avatar
  }

  console.log(OmitFieldSchema)
  // save data to db
  const result = await prisma.user.create({
    data,
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      address: true,
      avatar: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  })
  console.log(result)

  // send response
  return sendSuccess(reply, statusCode.CREATED, t('USER_CREATED'), result, { type: 'single' })
}
