import { WarehouseRepository } from '$/domain/repository/prisma/master'
import { WarehouseService } from '$/domain/service/master'
import { defineController } from './$relay'

const service = new WarehouseService(new WarehouseRepository)
export default defineController(() => ({
  get: async () => {
    const data = await service.getWarehouseList()
    if(data instanceof Error){
      return { status: 400, body: data.message}
    }
    return { status: 200, body: data }
  }
}))
