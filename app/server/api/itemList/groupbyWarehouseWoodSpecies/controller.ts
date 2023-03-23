import { defineController } from './$relay'
import { getGroupByWarehouseWoodspecies } from 'service/itemList'
export default defineController(() => ({
  get: async () => {
    const data = await getGroupByWarehouseWoodspecies()
    if (data instanceof Error) {
      return { status: 400, body: data.message }
    }
    return { status: 200, body: data }
  }
}))
