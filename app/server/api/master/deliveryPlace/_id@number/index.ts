import { DeliveryPlaceType } from '$/domain/entity/stock'

export type Methods = {
  get: {
    resBody: DeliveryPlaceType
  }
  post: {
    reqBody: { body: DeliveryPlaceType }
    resBody: DeliveryPlaceType
  }
  patch: {
    reqBody: { id: number; body: Partial<DeliveryPlaceType> }
    resBody: DeliveryPlaceType
  }
}
