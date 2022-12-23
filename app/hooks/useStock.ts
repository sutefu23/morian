import { UpdateItemData as UpdateItemServerData } from '~/server/domain/service/stock'
import { apiClient } from '~/utils/apiClient'
import { atom, useRecoilState, useRecoilCallback } from 'recoil'
import { recoilPersist } from 'recoil-persist'
import produce from 'immer'

const { persistAtom: persistAtomSaveData } = recoilPersist({
  key: 'recoil-persist-register-save-data',
  storage: typeof window === 'undefined' ? undefined : sessionStorage
})
const { persistAtom: persistHeaderAtomSaveData } = recoilPersist({
  key: 'recoil-persist-register-header-save-data',
  storage: typeof window === 'undefined' ? undefined : sessionStorage
})

export type SupplierType = {
  supplierId: number
  supplierName: string
  supplierManagerName: string
}

export type EditItemData = Partial<UpdateItemServerData>
export type EditItemArrayData = EditItemData[]
export type EditHeaderData = Partial<SupplierType>

const defaultHeaderData: EditHeaderData = {
  supplierId: undefined,
  supplierName: undefined,
  supplierManagerName: undefined
}

const defaultData: EditItemArrayData = [
  {
    lotNo: undefined,
    woodSpeciesId: undefined,
    woodSpeciesName: undefined,
    itemTypeId: undefined,
    itemTypeName: undefined,
    supplierId: undefined,
    supplierName: undefined,
    supplierManagerName: undefined,
    gradeId: undefined,
    gradeName: undefined,
    length: undefined,
    thickness: undefined,
    width: undefined,
    packageCount: undefined,
    warehouseId: undefined,
    warehouseName: undefined,
    cost: undefined,
    costUnitId: undefined,
    costUnitName: undefined,
    count: undefined,
    unitId: undefined,
    unitName: undefined,
    costPackageCount: undefined,
    enable: true
  }
]

const stockItemAtom = atom({
  key: 'stockItemAtom',
  default: defaultData[0]
})

const stockItemsAtom = atom({
  key: 'stockItemsAtom',
  default: defaultData,
  effects_UNSTABLE: [persistAtomSaveData]
})

const headerDataAtom = atom({
  key: 'headerDataAtom',
  default: defaultHeaderData,
  effects_UNSTABLE: [persistHeaderAtomSaveData]
})

const useStock = () => {
  const [, setStock] = useRecoilState<EditItemData>(stockItemAtom)
  const [stockItems, setStockItems] =
    useRecoilState<EditItemArrayData>(stockItemsAtom)
  const [headerData, ] =
    useRecoilState<EditHeaderData>(headerDataAtom)

  const resetData = useRecoilCallback(
    ({ reset }) =>
      () => {
        reset(stockItemsAtom)
        reset(headerDataAtom)
        window.location.reload()
      },
    []
  )

  const updateHeader = useRecoilCallback(
    ({ set }) =>
      (updateHeaderData: EditHeaderData): void => {
        const newHeaderData = { ...headerData, ...updateHeaderData }
        set(headerDataAtom, newHeaderData)
        const items = stockItems.map((item) => ({
          ...item,
          ...newHeaderData
        }))
        set(stockItemsAtom, items)
      },
    [headerData, stockItems]
  )

  const updateItem = useRecoilCallback(
    ({ set }) =>
      (index: number, item: EditItemData): void => {
        if (stockItems[index]) {
          const newStockData = produce(stockItems, (draft) => {
            draft[index] = { ...draft[index], ...item }
          })
          set(stockItemsAtom, newStockData)
        }
      },
    [stockItems]
  )

  const updateItemField = useRecoilCallback(
    ({ set }) =>
      <K extends keyof EditItemData>(
        index: number,
        key: K,
        val: EditItemData[K]
      ): void => {
        if (stockItems.length > 0) {
          const newStockData = produce(stockItems, (draft) => {
            draft[index] = { ...draft[index], [key]: val }
          })
          set(stockItemsAtom, newStockData)
        }
      },
    [stockItems]
  )

  const addItemLine = useRecoilCallback(
    ({ set }) =>
      () => {
        const newItems = produce(stockItems, (draft) => {
          draft?.push({...defaultData[0], ...headerData})
        })
        set(stockItemsAtom, newItems)
      },
    [stockItems]
  )

  const deleteItemLine = useRecoilCallback(
    ({ set }) =>
      (deleteIndex: number) => {
        const newItems = stockItems?.filter((_, i) => i !== deleteIndex)
        set(stockItemsAtom, newItems)
      },
    [stockItems]
  )

  const copyItemLine = useRecoilCallback(
    ({ set }) =>
      (copyIndex: number) => {
        if (stockItems.length === 0) return

        const newItem = stockItems[copyIndex]

        if (newItem === undefined) return

        const newItems = produce(stockItems, (draft) => {
          draft?.push(newItem)
        })

        set(stockItemsAtom, newItems)
      },
    [stockItems]
  )

  const checkValidStock = (
    data: EditItemData | undefined,
    index: number
  ): UpdateItemServerData | null => {
    if (!data) {
      console.error('checkValidStock data is null')
      return null
    }

    const {
      itemTypeId,
      itemTypeName,
      woodSpeciesId,
      woodSpeciesName,
      arrivalDate
    } = data

    if (!itemTypeId || !itemTypeName) {
      alert(`${index + 1}行目：分類は必須です。`)
      return null
    }
    if (!woodSpeciesId || !woodSpeciesName) {
      alert(`${index + 1}行目：樹種は必須です。`)
      return null
    }

    if (!arrivalDate) {
      alert(`${index + 1}行目：入荷日は必須です。`)
      return null
    }
    const { supplierId, supplierName } = data
    if (!supplierId) {
      console.error('checkValidStock supplierId is null')

      if (!supplierId) {
        alert(`${index + 1}行目：仕入先は必須です。`)
        return null
      }
      return null
    }
    const {
      packageCount,
      count,
      unitId,
      unitName,
      warehouseId,
      warehouseName,
      costPackageCount,
      costUnitName
    } = data

    if (!count) {
      alert(`${index + 1}行目：数量は必須です。`)
      return null
    }
    if (!unitId || !unitName) {
      alert(`${index + 1}行目：単位数量は必須です。`)
      return null
    }
    if (!warehouseId || !warehouseName) {
      alert(`${index + 1}行目：倉庫は必須です。`)
      return null
    }
    const { manufacturer, enable } = data
    if (!enable) {
      console.error('checkValidStock enable is null')
      return null
    }
    return {
      ...data,
      arrivalDate,
      itemTypeId,
      itemTypeName,
      woodSpeciesId,
      woodSpeciesName,
      supplierId,
      supplierName,
      packageCount,
      count,
      unitId,
      unitName,
      warehouseId,
      warehouseName,
      manufacturer,
      costPackageCount,
      costUnitName,
      tempCount: count,
      enable
    }
  }

  const postStock = useRecoilCallback(
    () => async () => {
      if (!headerData.supplierId || !headerData.supplierName) {
        alert('仕入先の情報が入っていません。')
        throw new Error()
      }

      const postItems = stockItems.map((item, index) => {
        const validItem = checkValidStock(item, index)
        if (!validItem) {
          throw new Error(`${index + 1}行目のデータが正しくありません。`)
        }
        return validItem
      })

      if (!postItems) {
        console.error('postItems is not valid')
        throw new Error()
      }

      const hasDuplicateKey = postItems.some((item) => {
        if(item.lotNo){
          return postItems.filter((i) => i.lotNo === item.lotNo).length > 1
        }
      })

      if (hasDuplicateKey) {
        alert('ロットNoが明細内で重複しています')
        throw new Error()
      }

      const res = await apiClient.itemList.post({ body: postItems })

      if(res instanceof Error) throw res

      if(res.status===201){
        if(res.body instanceof Error) throw res
        const message = res.body.map((item) => `ロットNo: ${item.lotNo}  ${item.woodSpeciesName}${item.itemTypeName}`)
        alert('登録しました\n' + message.join("\n"))
        resetData()  
      }
    },
    [deleteItemLine, headerData, resetData, stockItems]
  )

  return {
    headerData,
    setStock,
    stockItems,
    setStockItems,
    updateItem,
    updateHeader,
    updateItemField,
    addItemLine,
    deleteItemLine,
    copyItemLine,
    resetData,
    postStock
  }
}

export default useStock
