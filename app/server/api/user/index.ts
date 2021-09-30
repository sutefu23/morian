import type { AuthHeader } from '$/types';
import type { User, UserPass } from '$prisma/client';
export type Methods = {
   get: {
     resBody: User|null
  }
   post: {
     reqFormat: FormData
     reqBody: Pick<User, 'id'|'name'> & Pick<UserPass, 'pass'>
     resBody: User
  }
}
