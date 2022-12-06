import { User } from '$/domain/entity/user'

export type Methods = {
  get: {
    resBody: User
  }
  post: {
    reqBody: { body: User }
    resBody: User
  }
  patch: {
    reqBody: { id: number; body: Partial<User> }
    resBody: User
  }
}
