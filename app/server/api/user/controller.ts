import { UserRepository } from '$/domain/repository/prisma/user'
import { UserService } from '$/domain/service/user'
import { defineController } from './$relay'

const service = new UserService(new UserRepository())
export default defineController(() => ({
  get: async ({ query }) => {
    const data = await service.getUserList(query?.enable)
    if (data instanceof Error) {
      return { status: 400, body: data.message }
    }
    return { status: 200, body: data }
  }
}))
