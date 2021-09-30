import { WoodSpeciesType } from "$/domain/entity/stock";

export type Methods = {
  get: {
    resBody: WoodSpeciesType
  },
  post: {
    reqBody: {body: WoodSpeciesType},
    resBody: WoodSpeciesType
  }
  patch: {
    reqBody: {id: number, body: Partial<WoodSpeciesType>},
    resBody: WoodSpeciesType
  }
}
