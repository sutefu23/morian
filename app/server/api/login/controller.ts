import { defineController } from './$relay'
import { AuthService } from '$/domain/service/auth'
import { UserRepository } from '$/domain/repository/prisma/user'

const authService = new AuthService(new UserRepository)
export default defineController((fastify) => ({
  post: async ({ body }) => {
    return await authService.isValidUser(body.id, body.pass) === true
      ? { status: 201, body: { token: fastify.jwt.sign({ id: body.id }) } }
      : { status: 401 }
  }
}))
