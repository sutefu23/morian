import { HistoryDTO } from '@domain/dto/history'
import { HistoryProps } from '@domain/entity/stock'
import { UpdateHistoryData } from '@domain/service/stock'

export type Methods = {
  patch:{
    reqBody: { id: HistoryProps["id"], data: UpdateHistoryData}
    resBody: HistoryDTO
    status: 204
  }
  post: {
    reqBody: { data: UpdateHistoryData}
    resBody: HistoryDTO
    status: 204
  }
  delete:{
    reqBody: { id: HistoryProps["id"]}
  }
}
