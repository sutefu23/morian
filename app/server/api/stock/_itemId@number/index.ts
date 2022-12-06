import { ItemDTO } from '@domain/dto/item'
import { ItemProps } from '@domain/entity/stock'
import { UpdateItemData } from '@domain/service/stock'

export type Methods = {
  get: {
    resBody: ItemDTO | null | Error
    status: 200
  }
  patch: {
    reqBody: { id: ItemProps['id']; data: Partial<UpdateItemData> }
    resBody: ItemDTO
    status: 204
  }
}
