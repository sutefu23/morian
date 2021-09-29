import { Decimal } from '@prisma/client/runtime'
import { History } from "@domain/entity/stock";

export type HistoryDTO = {
  readonly 	id	:	number
  readonly 	note	:	string
  readonly 	date	:	Date
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
  readonly 	bookUserId	:	number
  readonly 	bookUserName	:	string
  readonly 	bookUserEnable	:	boolean
  readonly 	bookDate	:	Date
}

export const HistoryToDTO = (history: History):HistoryDTO => {
  return {
    id: history.id,
    note:history.note,
    date	:	history.date,
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
    bookDate	:	history.bookDate
  }
}

export const DTOtoHistory = (data: HistoryDTO) => {
  const reason = {
    id: data.reasonId,
    name: data.reasonName,
    status: data.reasonStatus,
    order: data.reasonOrder
  }


  const history = {
    ...data,
    reason
  }

  return history
}