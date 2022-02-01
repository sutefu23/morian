import { defineController } from './$relay'
import { ItemService } from '$/domain/service/stock'
import { ItemRepository } from '$/domain/repository/prisma/item'
import { HistoryRepository } from '$/domain/repository/prisma/history'

const itemService = new ItemService(
  new ItemRepository(),
  new HistoryRepository()
)
export default defineController(() => ({
  get: async ({ params }) => {
    const item = await itemService.findItemById(params.itemId)
    if (item instanceof Error) {
      return { status: 400, body: item }
    }
    return {
      status: 200,
      body: item
    }
  },
  patch: async ({ body, params }) => {
    const item = await itemService.updateItem(params.itemId, body.body)
    if (item instanceof Error) {
      console.error(item.message)
      return { status: 401, body: item }
    }
    return {
      status: 204,
      body: item
    }
  }
}))
