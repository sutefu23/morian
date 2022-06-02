import { defineHooks } from './/$relay';
import { UserRepository } from '$/domain/repository/prisma/user'
import { AuthService } from '$/domain/service/auth';

export type AdditionalRequest = {
   user: {
     id: number
  }
}
export default defineHooks((fastify) => ({
  onRequest: async (request, reply) =>{
    console.log(request.url)
    if(request.url !== '/api/login'){
      const Auth = AuthService.getInstance(new UserRepository)
      const token = request.headers.token
      if(!token || token.length === 0){
        reply.code(401).send({ error: 'Unauthorized' })
      }
      const me = await Auth.getUserFromToken(token as string, fastify.jwt.decode)   
      if(!me){
        reply.code(401).send({ error: 'Unauthorized' })
      }
    }
  }
}));
