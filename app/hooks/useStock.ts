import { useCallback} from 'react'
import { UpdateItemData } from '~/server/domain/service/stock'
import { Decimal } from 'decimal.js'
import type { Decimal as ServerDecimal } from "server/node_modules/decimal.js"
import { apiClient } from '~/utils/apiClient'
import { atom , useRecoilState } from 'recoil'

export type EditUpdataItemData = Partial<UpdateItemData>

const defaultData:EditUpdataItemData = {
  lotNo: '',
  woodSpeciesId: undefined,
  woodSpeciesName: undefined,
  itemTypeId: undefined,
  itemTypeName: undefined,
  supplierId: undefined,
  supplierName: undefined,
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

const demoData = {
  lotNo: 'HM-15233',
  woodSpeciesId: 1,
  woodSpeciesName: "桧",
  itemTypeId: 2,
  itemTypeName: "集成材",
  supplierId: 1,
  supplierName: "北材商事",
  gradeId: 1,
  gradeName: "A",
  length: 5000,
  thickness: 50,
  width: 500,
  packageCount: new Decimal(10) as unknown as ServerDecimal,
  warehouseId: 1,
  warehouseName: "本社",
  cost: new Decimal(100000) as unknown as ServerDecimal,
  costUnitId: 1,
  costUnitName: "㎥",
  count: new Decimal(10) as unknown as ServerDecimal,
  unitId: 1,
  unitName: "㎥",
  costPackageCount: new Decimal(0.125) as unknown as ServerDecimal,
  enable: true
}

const stockDataAtom = atom({
  key: 'stockDataAtom',
  default: defaultData,
});

const useStock = () => {
  const [stockData, setStockData] = useRecoilState<EditUpdataItemData>(stockDataAtom)

  const updateField = useCallback(
    <K extends keyof EditUpdataItemData>(
      key: K,
      val: EditUpdataItemData[K]
    ): void => {
      setStockData({ ...stockData, [key]: val})
    },
    [stockData]
  )

  const checkValidStock = (
    data: EditUpdataItemData | undefined
  ): UpdateItemData | null => {
    if (!data) {
      console.error('checkValidStock data is null')
      return null
    }

    const { lotNo, itemTypeId, itemTypeName, woodSpeciesId, woodSpeciesName, length } = data
    if (!lotNo) {
      alert('ロットNoは必須です。')
      return null
    }
    if (!itemTypeId || !itemTypeName) {
      alert('分類は必須です。')
      return null
    }
    if (!woodSpeciesId || !woodSpeciesName) {
      alert('樹種は必須です。')
      return null
    }


    const { supplierId, supplierName } = data
    if (!supplierId) {
      console.error('checkValidStock supplierId is null')

      if (!supplierId) {
        alert('仕入先は必須です。')
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
      alert('数量は必須です。')
      return null
    }
    if (!unitId || !unitName) {
      alert('単位数量は必須です。')
      return null
    }
    if (!warehouseId || !warehouseName) {
      alert('倉庫は必須です。')
      return null
    }
    const { manufacturer, enable } = data
    if (!enable) {
      console.error('checkValidStock enable is null')
      return null
    }
    return {
      ...data,
      lotNo,
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

  const useDemo = () => {
    setStockData({...demoData, packageCount: new Decimal(demoData.packageCount.toString()) as unknown as ServerDecimal})
  }

  const fetchOrderSheet = useCallback(async () => {
    const postStockData = checkValidStock(stockData)
    if (!postStockData) {
      console.error('postStockData is not valid')
      return
    }
    await apiClient.stock.post({
      body: {
        data: postStockData,
      }
    })

    alert('登録しました')
  }, [stockData])

  const postStock = useCallback(
    async () => {
      const postStockData = checkValidStock(stockData)
      if (!postStockData) {
        console.error('postStockData is not valid')
        throw new Error()
      }
      await apiClient.stock.post({
        body: {
          data: postStockData,
        }
      })

      alert('登録しました')
      return
    },
    [stockData]
  )

  return {
    stockData,
    setStockData,
    updateField,
    fetchOrderSheet,
    postStock,
    useDemo
  }
}

export default useStock
