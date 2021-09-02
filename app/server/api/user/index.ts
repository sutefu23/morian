import type { AuthHeader } from '$/types';
import type { User, UserPass } from '$prisma/client';
export type Methods = {
   get: {
     reqHeaders: AuthHeader
     resBody: User|null
  }
   post: {
     reqHeaders: AuthHeader
     reqFormat: FormData
     reqBody: Pick<User, 'id'|'name'> & Pick<UserPass, 'pass'>
     resBody: User
  }
}
