import { UserRepository } from '$/domain/repository/prisma/user'
import { UserService } from '$/domain/service/user'
import { defineController } from './$relay'

const service = new UserService(new UserRepository)
export default defineController(() => ({
  get: async (query) => {
    const data = await service.getUserById(query.params.id)
    if(data instanceof Error){
      return { status: 500, body: data.message}
    }
    return { status: 200, body: data }
  },
  post: async({ body }) => {
    const data = await service.createUser(body.body)
    if(data instanceof Error){
      return { status: 500, body: data.message}
    }
    return { status: 201, body: data }
  },
  patch: async({ body }) => {
    const data = await service.updateUser(body.id, body.body)
    if(data instanceof Error){
      return { status: 500, body: data.message}
    }
    return { status: 201, body: data }
  }
}))
