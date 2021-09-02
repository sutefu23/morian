import { AuthHeader } from '$/types';
import type { Item } from '$prisma/client';
import { Prisma } from '@prisma/client';

export type Methods = {
  get: {
    reqHeaders: AuthHeader
    resBody: Item | null,
    status: 200
  },
  post: {
    reqHeaders: AuthHeader
    reqBody:Prisma.ItemCreateInput
    resBody: Item
    status: 201
  },
   patch: {
    reqHeaders: AuthHeader
    reqBody: { id: Item["id"], body: Partial<Item>}
    resBody: Item
    status: 204
  }
}
