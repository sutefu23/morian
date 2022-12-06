import { GradeRepository } from '$/domain/repository/prisma/master'
import { GradeService } from '$/domain/service/master'
import { defineController } from './$relay'

const service = new GradeService(new GradeRepository())
export default defineController(() => ({
  get: async (query) => {
    const data = await service.findGradeById(query.params.id)
    if (data instanceof Error) {
      return { status: 400, body: data.message }
    }
    return { status: 200, body: data }
  },
  post: async ({ body }) => {
    const data = await service.createGrade(body.body)
    if (data instanceof Error) {
      return { status: 401, body: data.message }
    }
    return { status: 201, body: data }
  },
  patch: async ({ body }) => {
    const data = await service.updateGrade(body.id, body.body)
    if (data instanceof Error) {
      return { status: 401, body: data.message }
    }
    return { status: 201, body: data }
  }
}))
