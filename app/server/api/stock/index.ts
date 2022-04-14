import { ItemDTO } from '@domain/dto/item'
import { Query } from '$/domain/repository/interface'
import { UpdateItemData } from '$/domain/service/stock'
import { GetParam } from '$/domain/service/stock'
export type Methods = {
  get: {
    query: GetParam
    resBody: ItemDTO[]
    status: 200
  }
  post: {
    reqBody: { data: UpdateItemData; issueId?: number }
    resBody: ItemDTO
    status: 201
  }
}
