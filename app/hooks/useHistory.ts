import { useCallback} from 'react'
import { UpdateHistoryData } from '~/server/domain/service/stock'
import { apiClient } from '~/utils/apiClient'
import { atom , useRecoilState } from 'recoil'

export type EditUpdataHistoryData = Partial<UpdateHistoryData>

const defaultData:EditUpdataHistoryData = {
  itemId: undefined,
  note: "",
  date: new Date(),
  status: undefined,
  reason: undefined,
  reduceCount: undefined,
  addCount: undefined,
  editUserId: undefined,
  bookUserId: undefined,
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
      setHistoryData({ ...historyData, ...{ [key]: val } })
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
    const {itemId, date, status, reason, reduceCount, addCount, editUserId, bookDate, bookUserId} = data
    console.log(data)
    if(!itemId){
      alert("itemIdは必須です")
      return null
    }
    if(!date){
      alert("dateは必須です")
      return null
    }
    if(!status){
      alert("statusは必須です")
      return null
    }
    if(!reason){
      alert("reasonは必須です")
      return null
    }
    if(!reduceCount){
      alert("reduceCountは必須です")
      return null
    }
    if(!addCount){
      alert("addCountは必須です")
      return null
    }
    if(!editUserId){
      alert("editUserIdは必須です")
      return null
    }
    if(bookDate && !bookUserId){
      alert("予約者を入れた場合は予約日は必須です")
      return null
    }
    if(bookDate && !bookUserId){
      alert("予約日を入れた場合は予約者は必須です")
      return null
    }
    
    return {
      ...data,
      itemId,
      date,
      status,
      reason,
      reduceCount,
      addCount,
      editUserId,
      isTemp:true
    }
  }

  const postHistory = useCallback(
    async () => {
      const postHistoryData = checkValidHistory(historyData)
      if (!postHistoryData) {
        console.error('postHistoryData is not valid')
        return
      }

      await apiClient.history.post({
        body: {
          data: postHistoryData,
        }
      })

      alert('登録しました')
      return
    },
    [historyData]
  )

  const updateHistory = useCallback(
   async (id: number) => {
    const updateHistoryData = checkValidHistory(historyData)
    if (!updateHistoryData) {
      console.error('postHistoryData is not valid')
      return
    }
    await apiClient.history.patch({
      body: {
        id,
        data: updateHistoryData,
      }
    })
   },[historyData]
  )

  const deleteHistory = useCallback(
    async (id: number) => {
     await apiClient.history.delete({
       body: {
         id
       }
     })
    },[historyData]
   )
 
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
