import { ItemDTO } from '@domain/dto/item'
import { Query } from '$/domain/repository/interface'
import { UpdateItemData } from '$/domain/service/stock'
import { 入庫理由 } from '$/domain/entity/stock'

export type Methods = {
  get: {
    query: Query<ItemDTO> | Query<ItemDTO>[]
    resBody: ItemDTO[]
    status: 200
  }
  post: {
    reqBody: { data: UpdateItemData; status: 入庫理由.仕入 | 入庫理由.発注 }
    resBody: ItemDTO
    status: 201
  }
}
