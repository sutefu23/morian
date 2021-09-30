import { defineHooks } from './user/$relay';

export type AdditionalRequest = {
   user: {
     id: number
  }
}

export default defineHooks(() => ({
  onRequest: (request, reply) =>{
    if(request.url !== '/login'){
      request.jwtVerify().catch((err) => {
        reply.redirect('/login')
      })
    }
  }
}));
