import { getQuery } from "$/service/itemList"
import { Item } from "@prisma/client"
export type Methods = {
  get: {
    query: getQuery,
    resBody: Item[]
  }
}
