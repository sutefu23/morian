import { defineController } from './$relay'
import { getIssueItem, updateIssueItem } from '$/service/issueItem'

export default defineController(() => ({
  get: async (req) => {
    const issues = await getIssueItem(req.query)
    return { status: 200, body: issues }
  },
  patch: async ({ body }) => {
    const issue = await updateIssueItem(body.id, body.data)
    return { status: 201, body: issue }
  }
}))
