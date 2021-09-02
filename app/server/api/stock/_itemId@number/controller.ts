import { createItem } from '$/service/master/master'
import { getItemById, updateItem } from '$/service/stock'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({params}) => {
    return {status: 200, body: await getItemById(params.itemId)}
  },
  post: async ({body}) => ({
    status: 201,
    body: await createItem(body)
  }),
  patch: async ({body, params}) => ({
    status: 204,
    body: await updateItem(params.itemId, body.body)
  })
}))