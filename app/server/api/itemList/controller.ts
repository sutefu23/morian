import { defineController } from './$relay'
import { bulkInsert, getItemList } from "service/itemList"
export default defineController(() => ({
  get: async ({query}) => {
    const data = await getItemList(query)
    if(data instanceof Error){
      return { status: 400, body: data.message}
    }
    return { status: 200, body: data }
  },
  post: async ({body}) => {
    const data = await bulkInsert(body)
    if(data instanceof Error){
      throw data
    }
    return { status: 201, body: data }
  },
}))
