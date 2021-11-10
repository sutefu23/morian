import { ItemTypeRepository } from '$/domain/repository/prisma/master'
import { ItemTypeService } from '$/domain/service/master'
import { defineController } from './$relay'

const service = new ItemTypeService(new ItemTypeRepository)
export default defineController(() => ({
  get: async (query) => {
    const data = await service.findItemTypeById(query.params.id)
    if(data instanceof Error){
      return { status: 500, body: data.message}
    }
    return { status: 200, body: data }
  },
  post: async({ body }) => {
    const data = await service.createItemType(body.body)
    if(data instanceof Error){
      return { status: 500, body: data.message}
    }
    return { status: 201, body: data }
  },
  patch: async({ body }) => {
    const data = await service.updateItemType(body.id, body.body)
    if(data instanceof Error){
      return { status: 500, body: data.message}
    }
    return { status: 201, body: data }
  }
}))
