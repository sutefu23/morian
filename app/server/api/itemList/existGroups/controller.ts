import { defineController } from './$relay'
import { getExsitItemGroupList } from "service/itemList"
export default defineController(() => ({
  get: async () => {
    const data = await getExsitItemGroupList()
    if(data instanceof Error){
      return { status: 400, body: data.message}
    }
    return { status: 200, body: data }}
}))
