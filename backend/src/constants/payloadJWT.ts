import type { Roles } from '~/constants/roles.ts'

type Role = (typeof Roles)[keyof typeof Roles]

export interface payload {
  email: string
  role: Role
  name: string | null
  avatar: string | null
}
