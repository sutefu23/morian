import { AuthHeader } from '$/types';
import { ItemDTO } from '@domain/dto/item'
import { ItemProps } from '@domain/entity/stock'

export type Methods = {
  get: {
    reqHeaders: AuthHeader
    resBody: ItemDTO | null | Error,
    status: 200
  },
   patch: {
    reqHeaders: AuthHeader
    reqBody: { id: ItemProps["id"], body: Partial<ItemProps>}
    resBody: ItemDTO
    status: 204
  }
}
