import { DeliveryPlaceRepository } from '$/domain/repository/prisma/master'
import { DeliveryPlaceService } from '$/domain/service/master'
import { defineController } from './$relay'

const service = new DeliveryPlaceService(new DeliveryPlaceRepository())
export default defineController(() => ({
  get: async () => {
    const data = await service.getDeliveryPlaceList()
    if (data instanceof Error) {
      return { status: 400, body: data.message }
    }
    return { status: 200, body: data }
  }
}))
