import { defineController } from './$relay'
import { updateIssueItem } from '$/service/issueItem'

export default defineController(() => ({
  patch: async ({ body }) => {
    const issue = await updateIssueItem(body.id, body.data)
    return { status: 201, body: issue }
  }
}))
