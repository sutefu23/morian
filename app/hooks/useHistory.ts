import { useCallback} from 'react'
import { UpdateHistoryData } from '~/server/domain/service/stock'
import { Decimal } from 'decimal.js'
import { Units } from '~/server/domain/init/master'
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

const useStock = () => {
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

  }

  const postHistory = useCallback(
    async () => {
      const postStockData = checkValidHistory(historyData)
      if (!postStockData) {
        console.error('postHistoryData is not valid')
        return
      }

      await apiClient.history.post({
        body: {
          data: postStockData,
        }
      })

      alert('登録しました')
      return
    },
    [historyData]
  )

  return {
    historyData,
    setHistoryData,
    updateField,
    postHistory,
    updateHistory,
    deleteHistory,
  }
}

export default useStock
