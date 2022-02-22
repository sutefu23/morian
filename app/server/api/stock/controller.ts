import { defineController } from './$relay'
import { ItemService } from '$/domain/service/stock'
import { ItemRepository } from '$/domain/repository/prisma/item'
import { HistoryRepository } from '$/domain/repository/prisma/history'
import { 入庫理由 } from '$/domain/entity/stock'

const itemService = new ItemService(
  new ItemRepository(),
  new HistoryRepository()
)

export default defineController(() => ({
  get: async ({ query }) => {
    const item = await itemService.findManyItem(query)

    if (item instanceof Error) {
      console.error(item)
      return { status: 400, body: item }
    }
    return {
      status: 200,
      body: item
    }
  },
  post: async ({ body }) => {
    const item = await (async () => {
      if (body.status === 入庫理由.仕入) {
        return await itemService.registerItem(body.data)
      } else if (body.status === 入庫理由.発注) {
        return await itemService.issueItem(body.data)
      } else {
        return new Error('入庫理由は仕入か')
      }
    })()
    if (item instanceof Error) throw item
    return {
      status: 201,
      body: item
    }
  }
}))
