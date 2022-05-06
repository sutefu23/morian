import { AuthHeader } from '$/types';
import { HistoryDTO } from '@domain/dto/history'
import { HistoryProps } from '@domain/entity/stock'
import { UpdateHistoryData } from '@domain/service/stock'

export type Methods = {
  patch:{
    reqHeaders: AuthHeader
    reqBody: { id: HistoryProps["id"], body: UpdateHistoryData}
    resBody: HistoryDTO
    status: 204
  }
  post: {
    reqHeaders: AuthHeader
    reqBody: { body: UpdateHistoryData}
    resBody: HistoryDTO
    status: 204
  }
  delete:{
    reqHeaders: AuthHeader
    reqBody: { id: HistoryProps["id"]}
  }
}
