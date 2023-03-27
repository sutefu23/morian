import { defineController } from './$relay'
import { getAllLotId } from '$/service/historyList'
export default defineController(() => ({
  get: async () => {
    const data = await getAllLotId()
    if (data instanceof Error) {
      return { status: 400, body: data.message }
    }
    return { status: 200, body: data }
  }
}))
