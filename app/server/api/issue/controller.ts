import {
  createIssue,
  updateIssue,
  fetchIssues,
  deleteIssue
} from '$/service/issue'
import { defineController } from './$relay'

export default defineController(() => ({
  get: async (req) => {
    const issues = await fetchIssues(req.query)
    return { status: 200, body: issues }
  },
  post: async ({ body }) => {
    const issue = await createIssue(body)
    return { status: 201, body: issue }
  },
  patch: async ({ body }) => {
    const issue = await updateIssue(body.id, body.body)
    return { status: 204, body: issue }
  },
  delete: async ({ body }) => {
    const data = await deleteIssue(body)
    return { status: 200, body: data }
  }
}))
