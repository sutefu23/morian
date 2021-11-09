import { AuthHeader } from '$/types';
import { Item } from '@domain/entity/stock';
import { Prisma } from '@prisma/client';

export type Methods = {
  get: {
    reqHeaders: AuthHeader
    resBody: Item | null | Error,
    status: 200
  },
  post: {
    reqHeaders: AuthHeader
    reqBody:Item
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
