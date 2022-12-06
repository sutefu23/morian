import { defineController } from './$relay'
import { HistoryService } from '$/domain/service/stock'
import { HistoryRepository } from '$/domain/repository/prisma/history'
const historyService = new HistoryService(new HistoryRepository())
export default defineController(() => ({
  patch: async ({ body }) => {
    const data = await historyService.updateHistory(body.id, body.data)
    if (data instanceof Error) {
      console.error(data.message)
      return { status: 401, body: data }
    }
    return { status: 204, body: data }
  },
  post: async ({ body }) => {
    const data = await historyService.createHistory(body.data)
    if (data instanceof Error) {
      console.error(data.message)
      return { status: 401, body: data }
    }
    return { status: 204, body: data }
  },
  delete: async ({ body }) => {
    const data = await historyService.deleteHistory(body.id)
    if (data instanceof Error) {
      console.error(data.message)
      return { status: 401, body: data }
    }
    return { status: 200, body: data }
  }
}))
