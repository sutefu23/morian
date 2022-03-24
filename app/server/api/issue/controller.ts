import { createIssue, fetchIssues } from 'domain/service/issue'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async () => {
    const issues = await fetchIssues()
    return { status: 200, body: issues }
  },
  post: async ({ body }) => {
    const issue = await createIssue(body)
    return { status: 201, body: issue }
  }
}))
