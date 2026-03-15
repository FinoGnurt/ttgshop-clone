import type { Prisma } from 'prisma/client'
import type { QueryUsers, UpdateUser } from '~/schemas/user.schema.ts'

export function buildUserFilter(query: QueryUsers): Prisma.UserWhereInput {
  const { email, name, phone, address } = query

  const filter: Prisma.UserWhereInput = {}

  if (email || name || phone || address) {
    filter.OR = [
      email ? { email: { contains: email } } : null,
      name ? { name: { contains: name } } : null,
      phone ? { phone: { contains: phone } } : null,
      address ? { address: { contains: address } } : null
    ].filter(Boolean) as Prisma.UserWhereInput[]
  }

  return filter
}

export function buildPagination(page: number, limit: number) {
  const skip = (page - 1) * limit

  return { skip }
}

export const userSelect = {
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

export const sanitizeUpdateUserData = (body: UpdateUser) => {
  const { email, password, role, updatedAt, ...data } = body

  return {
    ...data,
    updatedAt: new Date()
  }
}
