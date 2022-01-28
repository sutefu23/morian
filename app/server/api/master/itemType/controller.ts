import { ItemTypeRepository } from '$/domain/repository/prisma/master'
import { ItemTypeService } from '$/domain/service/master'
import { defineController } from './$relay'

const service = new ItemTypeService(new ItemTypeRepository)
export default defineController(() => ({
  get: async () => {
    const data = await service.getItemTypeList()
    if(data instanceof Error){
      return { status: 400, body: data.message}
    }
    return { status: 200, body: data }
  }
}))
