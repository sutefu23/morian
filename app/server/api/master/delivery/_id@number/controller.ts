import { DeliveryPlaceRepository } from '$/domain/repository/prisma/master'
import { DeliveryPlaceService } from '$/domain/service/master'
import { defineController } from './$relay'

const service = new DeliveryPlaceService(new DeliveryPlaceRepository)
export default defineController(() => ({
  get: async (query) => {
    const data = await service.findDeliveryPlaceById(query.params.id)
    if(data instanceof Error){
      return { status: 400, body: data.message}
    }
    return { status: 200, body: data }
  },
  post: async({ body }) => {
    const data = await service.createDeliveryPlace(body.body)
    if(data instanceof Error){
      return { status: 401, body: data.message}
    }
    return { status: 201, body: data }
  },
  patch: async({ body }) => {
    const data = await service.updateDeliveryPlace(body.id, body.body)
    if(data instanceof Error){
      return { status: 401, body: data.message}
    }
    return { status: 201, body: data }
  }
}))
