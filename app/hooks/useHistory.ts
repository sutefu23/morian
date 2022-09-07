import { useCallback} from 'react'
import { UpdateHistoryData } from '~/server/domain/service/stock'
import { apiClient } from '~/utils/apiClient'
import { atom , useRecoilState } from 'recoil'
import { 出庫理由 } from '~/server/domain/entity/stock'
import { StockReason } from '~/server/domain/init/master'

export type EditUpdataHistoryData = Partial<UpdateHistoryData>

const defaultData:EditUpdataHistoryData = {
  itemId: undefined,
  note: "",
  date: new Date(),
  status: undefined,
  reasonId: undefined,
  reduceCount: undefined,
  addCount: undefined,
  editUserId: undefined,
  editUserName: undefined,
  bookUserId: undefined,
  bookUserName: undefined,
  bookDate: undefined,
  isTemp: false
}


const historyDataAtom = atom({
  key: 'historyDataAtom',
  default: defaultData,
});

const useHistory = () => {
  const [historyData, setHistoryData] = useRecoilState<EditUpdataHistoryData>(historyDataAtom)

  const updateField = useCallback(
    <K extends keyof EditUpdataHistoryData>(
      key: K,
      val: EditUpdataHistoryData[K]
    ): void => {
      setHistoryData({ ...historyData, [key]: val})
    },
    [historyData]
  )


  const checkValidHistory = (
    data: EditUpdataHistoryData | undefined
  ): UpdateHistoryData | null => {
    if (!data) {
      console.error('checkValidHistory data is null')
      return null
    }
    const {itemId, date, status, reasonId, reduceCount, addCount, editUserId, editUserName} = data
    const { bookDate, bookUserId, bookUserName } = data
    if(!itemId){
      alert("itemIdは必須です")
      return null
    }
    if(!date){
      alert("日付は必須です")
      return null
    }
    if(!status){
      alert("ステータスは必須です")
      return null
    }
    if(!reasonId){
      alert("理由は必須です")
      return null
    }
    if(!addCount){
      alert("入庫数は必須です")
      return null
    }
    if(!reduceCount){
      alert("出庫数は必須です")
      return null
    }
    if(addCount.toNumber() == 0 && reduceCount.toNumber() == 0){
      alert("数量が入っていません")
      return null
    }
    if(!editUserId || !editUserName){
      alert("editUserは必須です")
      return null
    }
    if(bookDate && !bookUserId){
      alert("予約者を入れた場合は予約期限は必須です")
      return null
    }
    if(bookDate && !bookUserId){
      alert("予約期限を入れた場合は予約者は必須です")
      return null
    }
    const reason = StockReason.find(r => r.id === reasonId)?.name
    if (reason == 出庫理由.受注予約 || reason == 出庫理由.見積){
      if(!bookUserId || !bookDate || !bookUserName){
        alert("出庫理由が予約か見積の場合は予約者と予約期限は必須です")
        return null  
      }
    }
    return {
      ...data,
      itemId,
      date,
      status,
      reasonId,
      reduceCount,
      addCount,
      editUserId,
      editUserName,
      bookDate,
      bookUserId,
      bookUserName,
      isTemp:false
    }
  }

  const postHistory = useCallback(
    async () => {
      const postHistoryData = checkValidHistory(historyData)
      if (!postHistoryData) {
        console.error('postHistoryData is not valid')
        return false
      }
      await apiClient.history.post({
        body: {
          data: postHistoryData,
        }
      })
      return true
    },
    [historyData]
  )

  const updateHistory = useCallback(
   async (id: number) => {
    const updateHistoryData = checkValidHistory(historyData)
    if (!updateHistoryData) {
      console.error('postHistoryData is not valid')
      return false
    }
    await apiClient.history.patch({
      body: {
        id,
        data: updateHistoryData,
      }
    })
    return true
   },[historyData]
  )

  const deleteHistory = async (id: number) => {
    await apiClient.history.delete({
      body: {
        id
      }
    })
  }

 
  return {
    historyData,
    setHistoryData,
    updateField,
    postHistory,
    updateHistory,
    deleteHistory,
    defaultData
  }
}

export default useHistory
