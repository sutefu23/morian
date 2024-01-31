import { UpdateItemData } from '$/domain/service/stock'
import { getQuery } from '$/service/itemList'
import { Item, History } from '@prisma/client'
export type Methods = {
  get: {
    query: getQuery
    resBody: (Item & {
      history?: History[]
    })[]
  }
  post: {
    reqBody: UpdateItemData[]
    resBody: Item[] | Error
    status: 201
  }
}
