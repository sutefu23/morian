import { AuthHeader } from '$/types';
import { ItemDTO } from '@domain/dto/item'
import { ItemProps } from '@domain/entity/stock'
import { Prisma } from '@prisma/client';

export type Methods = {
  get: {
    reqHeaders: AuthHeader
    resBody: ItemDTO | null | Error,
    status: 200
  },
  post: {
    reqHeaders: AuthHeader
    reqBody:ItemProps
    resBody: ItemDTO
    status: 201
  },
   patch: {
    reqHeaders: AuthHeader
    reqBody: { id: ItemProps["id"], body: Partial<ItemProps>}
    resBody: ItemDTO
    status: 204
  }
}
