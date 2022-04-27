import { defineController } from './$relay'
import { getItemList } from "service/itemList"
export default defineController(() => ({
  get: async ({query}) => {
    const data = await getItemList(query)
    if(data instanceof Error){
      return { status: 400, body: data.message}
    }
    return { status: 200, body: data }}
}))