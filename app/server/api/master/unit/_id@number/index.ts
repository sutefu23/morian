import { UnitType } from '$/domain/entity/stock'

export type Methods = {
  get: {
    resBody: UnitType
  }
  post: {
    reqBody: { body: UnitType }
    resBody: UnitType
  }
  patch: {
    reqBody: { id: number; body: Partial<UnitType> }
    resBody: UnitType
  }
}
