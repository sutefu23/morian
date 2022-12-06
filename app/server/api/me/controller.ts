import { defineController } from './$relay'
import { UserService } from '$/domain/service/user'
import { UserRepository } from '$/domain/repository/prisma/user'
import { AuthService } from '$/domain/service/auth'

const userService = new UserService(new UserRepository())
const Auth = AuthService.getInstance(new UserRepository())

export default defineController((fastify) => ({
  get: async ({ headers }) => {
    const token = headers.authorization
    const me = await Auth.getUserFromToken(token, fastify.jwt.decode)
    if (me) {
      return { status: 201, body: me }
    } else {
      return { status: 401, body: '認証が必要です' }
    }
  },
  patch: async ({ headers, body }) => {
    const token = headers.authorization
    const me = await Auth.getUserFromToken(token, fastify.jwt.decode)
    if (me) {
      await userService.updateUser(me.id, { pass: body.pass })
      return { status: 201, body: me }
    } else {
      return { status: 401, body: '認証が必要です' }
    }
  }
}))
