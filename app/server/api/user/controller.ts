import { UserRepository } from '$/domain/repository/prisma/user'
import { UserService } from '$/domain/service/user'
import { defineController } from './$relay'

const service = new UserService(new UserRepository)
export default defineController(() => ({
  get: async () => {
    const data = await service.getUserList()
    if(data instanceof Error){
      return { status: 500, body: data.message}
    }
    return { status: 200, body: data }
  }
}))