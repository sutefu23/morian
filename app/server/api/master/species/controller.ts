import { WoodSpeciesRepository } from '$/domain/repository/prisma/master'
import { SpeciesService } from '$/domain/service/master'
import { defineController } from './$relay'

const service = new SpeciesService(new WoodSpeciesRepository())
export default defineController(() => ({
  get: async () => {
    const data = await service.getSpeciesList()
    if (data instanceof Error) {
      return { status: 400, body: data.message }
    }
    return { status: 200, body: data }
  }
}))
