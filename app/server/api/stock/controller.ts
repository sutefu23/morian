import { defineController } from './$relay'
import { ItemService } from '$/domain/service/stock'
import { ItemRepository } from '$/domain/repository/prisma/item'
import { HistoryRepository } from '$/domain/repository/prisma/history'

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
  }
}))
