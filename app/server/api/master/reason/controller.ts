import { ReasonRepository } from '$/domain/repository/prisma/master'
import { ReasonService } from '$/domain/service/master'
import { defineController } from './$relay'

const service = new ReasonService(new ReasonRepository)
export default defineController(() => ({
  get: async () => {
    const data = await service.getReasonList()
    if(data instanceof Error){
      return { status: 500, body: data.message}
    }
    return { status: 200, body: data }
  }
}))
