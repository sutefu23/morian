import { SupplierRepository } from '$/domain/repository/prisma/supplier'
import { SupplierService } from '$/domain/service/supplier'
import { defineController } from './$relay'

const service = new SupplierService(new SupplierRepository)
export default defineController(() => ({
  get: async ({query}) => {
    const data = await (() => {
      if(query?.name){
        console.log(service.filterSuppliers(query.name))
        return service.filterSuppliers(query.name)
      }else{
        return service.getSupplierList(query?.enable)
      }
    })()
    if(data instanceof Error){
      return { status: 500, body: data.message}
    }
    return { status: 200, body: data }
  }
}))