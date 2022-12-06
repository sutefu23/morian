import { ReasonType, 入庫理由, 出庫理由 } from '@domain/entity/stock'

export type ReasonDTO = {
  readonly reasonId: number
  readonly reasonName: string
  readonly reasonStatus: number
  readonly reasonOrder: number
}

export const ReasonToDTO = (reason: ReasonType): ReasonDTO => {
  return {
    reasonId: reason.id,
    reasonName: reason.name,
    reasonStatus: reason.status,
    reasonOrder: reason.order
  }
}

export const DTOtoReason = (data: ReasonDTO): ReasonType => {
  const reason = {
    id: data.reasonId,
    name: data.reasonName as 入庫理由 | 出庫理由,
    status: data.reasonStatus,
    order: data.reasonOrder
  }

  return reason
}
