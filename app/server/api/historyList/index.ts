import { getQuery } from '$/service/historyList'
import { History, Item } from '@prisma/client'
export type Methods = {
  get: {
    query: getQuery
    resBody: (Item & {
      history: History[];
  })[]
  }
}
