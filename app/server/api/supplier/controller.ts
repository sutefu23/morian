import { SupplierRepository } from '$/domain/repository/prisma/supplier'
import { SupplierService } from '$/domain/service/supplier'
import { defineController } from './$relay'

const service = new SupplierService(new SupplierRepository)
export default defineController(() => ({
  get: async () => {
    const data = await service.getSupplierList()
    if(data instanceof Error){
      return { status: 500, body: data.message}
    }
    return { status: 200, body: data }
  }
}))