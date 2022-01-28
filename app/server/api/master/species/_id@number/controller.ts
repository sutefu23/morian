import { WoodSpeciesRepository } from '$/domain/repository/prisma/master'
import { SpeciesService } from '$/domain/service/master'
import { defineController } from './$relay'

const service = new SpeciesService(new WoodSpeciesRepository)
export default defineController(() => ({
  get: async (query) => {
    const data = await service.findSpeciesById(query.params.id)
    if(data instanceof Error){
      return { status: 400, body: data.message}
    }
    return { status: 200, body: data }
  },
  post: async({ body }) => {
    const data = await service.createSpecies(body.body)
    if(data instanceof Error){
      return { status: 401, body: data.message}
    }
    return { status: 201, body: data }
  },
  patch: async({ body }) => {
    const data = await service.updateSpecies(body.id, body.body)
    if(data instanceof Error){
      return { status: 401, body: data.message}
    }
    return { status: 201, body: data }
  }
}))
