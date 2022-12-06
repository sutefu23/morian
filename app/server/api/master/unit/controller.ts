import { UnitRepository } from '$/domain/repository/prisma/master'
import { UnitService } from '$/domain/service/master'
import { defineController } from './$relay'

const service = new UnitService(new UnitRepository())
export default defineController(() => ({
  get: async () => {
    const data = await service.getUnitList()
    if (data instanceof Error) {
      return { status: 400, body: data.message }
    }
    return { status: 200, body: data }
  }
}))
