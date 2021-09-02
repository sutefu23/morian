import { defineHooks } from './$relay';

export type AdditionalRequest = {
   user: {
     id: number
  }
}

export default defineHooks(() => ({
  onRequest: (request, reply) =>
    request.jwtVerify().catch((err) => reply.send(err))
}));
