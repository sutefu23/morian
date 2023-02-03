import { defineController } from './$relay'
import { deleteItem, getItem, modifyItemParam } from '$/service/itemData'
export default defineController(() => ({
  get: async (query) => {
    const data = await getItem(query.params.id)
    return { status: 200, body: data }
  },
  patch: async ({ body }) => {
    const data = await modifyItemParam(body.id, body.data)
    return { status: 204, body: data }
  },
  delete: async (query) => {
    const data = await deleteItem(query.params.id)
    return { status: 200, body: data }
  }
}))
