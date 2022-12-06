import { ItemDTO } from '@domain/dto/item'
import { GetParam } from '$/domain/service/stock'
export type Methods = {
  get: {
    query: GetParam
    resBody: ItemDTO[]
    status: 200
  }
}
