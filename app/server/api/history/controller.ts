import { defineController } from './$relay'
import { createHistory, updateHistory, deleteHistory } from '$/service/historyData'

export default defineController(() => ({
  patch: async ({ body }) => {
    const data = await updateHistory(body.id, body.data)
    if (data instanceof Error) {
      console.error(data.message)
      return { status: 401, body: data }
    }
    return { status: 204, body: data }
  },
  post: async ({ body }) => {
    const data = await createHistory(body.data)
    if (data instanceof Error) {
      return { status: 401, body: data }
    }
    return { status: 201, body: data }
  },
  delete: async ({ body }) => {
    const data = await deleteHistory(body.id)
    if (data instanceof Error) {
      console.error(data.message)
      return { status: 401, body: data }
    }
    return { status: 200, body: data }
  }
}))
