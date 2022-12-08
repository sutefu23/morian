import { PartialUpdateItemData } from '$/domain/service/stock'
import { Item } from '@prisma/client'

export type Methods = {
  get: {
    resBody: Item | null
  },
  patch: {
    reqBody: { id: number; data: PartialUpdateItemData }
    resBody: Item
    status: 204
  }
}
