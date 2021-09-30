import { defineController } from './$relay'
import { UserService } from '$/domain/service/user'
import { UserRepository } from '$/domain/repository/prisma/user'

const userService = new UserService(new UserRepository)

export default defineController((fastify) => ({
  get: async ({ headers }) =>{
    const token = headers.authorization
    const decodedToken : {id: string}|null = fastify.jwt.decode(token)
    console.log(decodedToken)
    if(decodedToken){
      const me = await userService.getUserById(Number(decodedToken.id))
      if(me instanceof Error){
        return { status : 500, body: me}
      }
      return { status: 201, body: me }
    }else{
      return { status: 401 }
    }
  }
}))
