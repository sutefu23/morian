import { defineController } from './$relay'
import { getHistory, modifyHistoryParam } from '$/service/historyData'
export default defineController(() => ({
  get: async (query) => {
    const data = await getHistory(query.params.id)
    return { status: 200, body: data }
  },
  patch: async ({ body }) => {
    const data = await modifyHistoryParam(body.id, body.data)
    return { status: 204, body: data }
  }
}))
