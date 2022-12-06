import { User } from '$/domain/entity/user'

export type Methods = {
  get: {
    query?: {
      enable?: boolean
    }
    resBody: User[]
  }
}
