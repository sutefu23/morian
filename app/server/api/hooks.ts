import { defineHooks } from './me/$relay';
import { UserRepository } from '$/domain/repository/prisma/user'
import { AuthService } from '$/domain/service/auth';

export type AdditionalRequest = {
   user: {
     id: number
  }
}
export default defineHooks((fastify) => ({
  onRequest: (request, reply) =>{
    console.log(request.headers)
 
  }
}));
