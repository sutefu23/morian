import { defineController } from './$relay'
import { getHistory, updateHistory } from '$/service/historyData'
export default defineController(() => ({
  get: async (query) => {
    const data = await getHistory(query.params.id)
    return { status: 200, body: data }
  },
  patch: async ({ body }) => {
    const data = await updateHistory(body.id, body.data)
    return { status: 201, body: data }
  }
}))
