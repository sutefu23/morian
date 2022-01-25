import { Decimal } from 'decimal.js'
import { History, ReasonType } from "@domain/entity/stock";
import { DTOtoReason } from "./reason"

export type HistoryDTO = {
  readonly 	id	:	number
  readonly 	note	:	string
  readonly 	date	:	Date
  readonly  status: number
  readonly 	reasonId	:	number
  readonly 	reasonName	:	string
  readonly 	reasonStatus	:	number
  readonly  reasonOrder: number
  readonly 	itemId	:	number
  readonly 	reduceCount	:	Decimal
  readonly 	addCount	:	Decimal
  readonly 	editUserName	:	string
  readonly 	editUserId	:	number
  readonly 	editUserEnable	:	boolean
  readonly 	order	:	number
  readonly 	bookUserId	:	number | null
  readonly 	bookUserName	:	string | null
  readonly 	bookUserEnable	:	boolean
  readonly 	bookDate	:	Date | null
  readonly  isTemp: boolean
}

export const HistoryToDTO = (history: History):HistoryDTO => {
  return {
    id: history.id,
    note:history.note,
    date	:	history.date,
    status: history.status,
    reasonId	:	history.reason.id,
    reasonName	:	history.reason.name,
    reasonStatus	:	history.reason.status,
    reasonOrder	:	history.reason.order,
    itemId	:	history.itemId,
    reduceCount	:	history.reduceCount,
    addCount	:	history.addCount,
    editUserName	:	history.editUserName,
    editUserId	:	history.editUserId,
    editUserEnable	:	history.editUserEnable,
    order	:	history.order,
    bookUserName	:	history.bookUser.Name,
    bookUserId	:	history.bookUserId,
    bookUserEnable	:	history.bookUser.enable,
    bookDate	:	history.bookDate,
    isTemp	:	history.isTemp
  }
}

export const filterReasonFromDTO = (data: HistoryDTO): ReasonType => {
  return DTOtoReason(
    {
      reasonId: data.reasonId,
      reasonName: data.reasonName,
      reasonStatus: data.reasonStatus,
      reasonOrder: data.reasonOrder
    }
  )
}
export const DTOtoHistory = (data: HistoryDTO) => {
  const reason = filterReasonFromDTO(data)

  const history = {
    ...data,
    reason
  }

  return history
}