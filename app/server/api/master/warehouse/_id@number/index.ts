import { WarehouseType } from '$/domain/entity/stock'

export type Methods = {
  get: {
    resBody: WarehouseType
  }
  post: {
    reqBody: { body: WarehouseType }
    resBody: WarehouseType
  }
  patch: {
    reqBody: { id: number; body: Partial<WarehouseType> }
    resBody: WarehouseType
  }
}
