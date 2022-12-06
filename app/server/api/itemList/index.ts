import { UpdateItemData } from '$/domain/service/stock'
import { getQuery } from '$/service/itemList'
import { Item } from '@prisma/client'
export type Methods = {
  get: {
    query: getQuery
    resBody: Item[]
  }
  post: {
    reqBody: UpdateItemData[]
    resBody: Item[] | Error
    status: 201
  }
}
