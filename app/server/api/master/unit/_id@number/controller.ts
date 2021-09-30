import { UnitRepository } from '$/domain/repository/prisma/master'
import { UnitService } from '$/domain/service/master'
import { defineController } from './$relay'

const service = new UnitService(new UnitRepository)
export default defineController(() => ({
  get: async (query) => {
    const data = await service.findUnitById(query.params.id)
    if(data instanceof Error){
      return { status: 500, body: data.message}
    }
    return { status: 200, body: data }
  },
  post: async({ body }) => {
    const data = await service.createUnit(body.body)
    if(data instanceof Error){
      return { status: 500, body: data.message}
    }
    return { status: 201, body: data }
  },
  patch: async({ body }) => {
    const data = await service.updateUnit(body.id, body.body)
    if(data instanceof Error){
      return { status: 500, body: data.message}
    }
    return { status: 201, body: data }
  }
}))
