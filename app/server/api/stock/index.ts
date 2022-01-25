import { AuthHeader } from '$/types'
import { ItemDTO } from '@domain/dto/item'
import { Query } from '$/domain/repository/interface'
import { UpdateItemData } from '$/domain/service/stock'

export type Methods = {
  get: {
    query: Query<ItemDTO> | Query<ItemDTO>[]
    resBody: ItemDTO[]
    status: 200
  }
  post: {
    reqHeaders: AuthHeader
    reqBody: UpdateItemData
    resBody: ItemDTO
    status: 201
  }
}
