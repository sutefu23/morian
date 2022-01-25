import { AuthHeader } from '$/types';
import { ItemDTO } from '@domain/dto/item'
import { ItemProps } from '@domain/entity/stock'
import { UpdateItemData } from '@domain/service/stock'

export type Methods = {
  get: {
    reqHeaders: AuthHeader
    resBody: ItemDTO | null | Error,
    status: 200
  },
   patch: {
    reqHeaders: AuthHeader
    reqBody: { id: ItemProps["id"], body: Partial<UpdateItemData>}
    resBody: ItemDTO
    status: 204
  }
}
