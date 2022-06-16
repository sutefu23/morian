import { getUserEditedHistoryList } from '$/service/historyList'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async ({query}) => {
    const data = await getUserEditedHistoryList(query.editUserId)
    if(data instanceof Error){
      return { status: 400, body: data.message}
    }
    return { status: 200, body: data }}
}))
