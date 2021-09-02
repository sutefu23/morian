import { defineController } from './$relay'
import { getUserInfoById, createUser } from '$/service/user'

export default defineController(() => ({
  get: async ({ user }) => {
    return { 
      status: 200,
      body: await getUserInfoById(user.id) }
  },
  post: async ({ body }) => ({
    status: 201,
    body: await createUser(body.id, body.name, body.pass)
  })
}))
