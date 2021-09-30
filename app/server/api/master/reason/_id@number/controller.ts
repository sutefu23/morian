import { ReasonRepository } from '$/domain/repository/prisma/master'
import { ReasonService } from '$/domain/service/master'
import { defineController } from './$relay'

const service = new ReasonService(new ReasonRepository)
export default defineController(() => ({
  get: async (query) => {
    const data = await service.findReasonById(query.params.id)
    if(data instanceof Error){
      return { status: 500, body: data.message}
    }
    return { status: 200, body: data }
  },
  patch: async({ body }) => {
    const data = await service.updateReason(body.id, body.body)
    if(data instanceof Error){
      return { status: 500, body: data.message}
    }
    return { status: 201, body: data }
  }
}))
