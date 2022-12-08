import { StockReason } from '$/domain/init/master'

export const getReasonById = (reasonId: number) => {
  const reason = StockReason.find((r) => r.id === reasonId)

  if (!reason) {
    throw new Error('ItemTypeデータが見つかりません')
  }
  
  return reason
}
