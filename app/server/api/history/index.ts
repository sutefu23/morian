import { UpdateHistoryData } from '@domain/service/stock'
import { Item, History } from '@prisma/client'

export type Methods = {
  patch: {
    reqBody: { id: number; data: UpdateHistoryData }
    resBody: [History,Item]
    status: 204
  }
  post: {
    reqBody: { data: UpdateHistoryData }
    resBody: [History,Item]
    status: 201
  }
  delete: {
    reqBody: { id: number }
  }
}
