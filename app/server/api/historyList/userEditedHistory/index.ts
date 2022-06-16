import { History, Item } from "@prisma/client"
export type Methods = {
  get: {
    query: {editUserId: number},
    resBody: (Item & {
      history: History[];
    })[]
  }
}
