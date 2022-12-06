import { SupplierRepository } from '$/domain/repository/prisma/supplier'
import { SupplierService } from '$/domain/service/supplier'
import { defineController } from './$relay'

const service = new SupplierService(new SupplierRepository())
export default defineController(() => ({
  get: async (query) => {
    const data = await service.findSupplierById(query.params.id)
    if (data instanceof Error) {
      return { status: 500, body: data.message }
    }
    return { status: 200, body: data }
  },
  post: async ({ body }) => {
    const data = await service.createSupplier(body.body)
    if (data instanceof Error) {
      return { status: 500, body: data.message }
    }
    return { status: 201, body: data }
  },
  patch: async ({ body }) => {
    const data = await service.updateSupplier(body.id, body.body)
    if (data instanceof Error) {
      return { status: 500, body: data.message }
    }
    return { status: 201, body: data }
  }
}))
