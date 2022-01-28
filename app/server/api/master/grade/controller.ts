import { GradeRepository } from '$/domain/repository/prisma/master'
import { GradeService } from '$/domain/service/master'
import { defineController } from './$relay'

const service = new GradeService(new GradeRepository)
export default defineController(() => ({
  get: async () => {
    const data = await service.getGradeList()
    if(data instanceof Error){
      return { status: 400, body: data.message}
    }
    return { status: 200, body: data }
  }
}))
