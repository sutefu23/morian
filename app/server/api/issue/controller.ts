import { createIssue, fetchIssues } from '$/service/issue'
import { defineController } from './$relay'


export default defineController(() => ({
  get: async (req) => {
    const issues = await fetchIssues(req.query)
    return { status: 200, body: issues }
  },
  post: async ({ body }) => {
    const issue = await createIssue(body)
    return { status: 201, body: issue }
  }
}))
