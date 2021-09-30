import { WarehouseRepository } from '$/domain/repository/prisma/master'
import { WarehouseService } from '$/domain/service/master'
import { defineController } from './$relay'

const service = new WarehouseService(new WarehouseRepository)
export default defineController(() => ({
  get: async (query) => {
    const data = await service.findWarehouseById(query.params.id)
    if(data instanceof Error){
      return { status: 500, body: data.message}
    }
    return { status: 200, body: data }
  },
  post: async({ body }) => {
    const data = await service.createWarehouse(body.body)
    if(data instanceof Error){
      return { status: 500, body: data.message}
    }
    return { status: 201, body: data }
  },
  patch: async({ body }) => {
    const data = await service.updateWarehouse(body.id, body.body)
    if(data instanceof Error){
      return { status: 500, body: data.message}
    }
    return { status: 201, body: data }
  }
}))
