import { User } from '$/domain/entity/user'
import { AuthHeader } from '$/types'
import type { UserPass } from '$prisma/client'

export type Methods = {
  get: {
    reqHeaders: AuthHeader
    resBody: User | Error
  }
  patch: {
    reqHeaders: AuthHeader
    reqFormat: FormData
    reqBody: Pick<UserPass, 'pass'>
    resBody: User
  }
}
