import { defineController } from './$relay'
import { UserService } from '$/domain/service/user'
import { UserRepository } from '$/domain/repository/prisma/user'

const userService = new UserService(new UserRepository)

export default defineController((fastify) => ({
  get: async ({ headers }) =>{
    const token = headers.authorization
    const decodedToken : {payload:{id: string}}|null = fastify.jwt.decode(token)
    if(decodedToken){
      const me = await userService.getUserById(Number(decodedToken.payload.id))
      if(me instanceof Error){
        return { status : 500, body: me}
      }
      return { status: 201, body: me }
    }else{
      return { status: 401 }
    }
  },
  patch: async({ headers, body }) =>{
    const token = headers.authorization
    const decodedToken : {payload:{id: string}}|null = fastify.jwt.decode(token)
    if(decodedToken){
      const me = await userService.getUserById(Number(decodedToken.payload.id))
      if(me instanceof Error){
        return { status : 500, body: me}
      }
      await userService.updateUser(me.id, { pass: body.pass})
      return { status: 201, body: me }
    }else{
      return { status: 401 }
    }
  }
}))
