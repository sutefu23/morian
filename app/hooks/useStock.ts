import { useCallback} from 'react'
import { UpdateItemData } from '~/server/domain/service/stock'
import { Decimal } from 'decimal.js'
import { Units } from '~/server/domain/init/master'
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
  packageCount: new Decimal(10),
  warehouseId: 1,
  warehouseName: "本社",
  cost: new Decimal(100000),
  costUnitId: 1,
  costUnitName: "㎥",
  count: new Decimal(10),
  unitId: 1,
  unitName: "㎥",
  costPackageCount: new Decimal(0.125),
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

  const calcCostPackageCount = useCallback(() => {
    if (
      stockData?.costUnitId &&
      stockData.width &&
      stockData.thickness &&
      stockData.packageCount
    ) {
      const { width, length, thickness, packageCount } = stockData
      if (length === '乱尺' || !length) return

      const unit = Units.find((u) => u.id === stockData.costUnitId)?.name
      const costPackageCount = (() => {
        Decimal.set({ precision: 2, rounding: Decimal.ROUND_HALF_UP })
        const thousand = new Decimal(1000)
        const tubo = new Decimal(3.3)
        const dWidth = new Decimal(width)
        const dLength = new Decimal(length)
        const dThickness = new Decimal(thickness)
        const dPackageCount = new Decimal(packageCount)
        switch (unit) {
          case '㎥': // 幅/1000*長さ/1000*厚み/1000
            return dWidth
              .dividedBy(thousand)
              .mul(dLength.dividedBy(thousand))
              .mul(dThickness.dividedBy(thousand))
          case '平米': // 幅/1000*長さ/1000
            return dWidth
              .dividedBy(thousand)
              .mul(dLength.dividedBy(thousand))
              .mul(dPackageCount)
          case '坪': // 幅/1000*長さ/1000/3.3
            return dWidth
              .dividedBy(thousand)
              .mul(dLength.dividedBy(thousand))
              .dividedBy(tubo)

          default:
            break
        }
      })()
      return costPackageCount
    }
  }, [
    stockData.costUnitId,
    stockData.width,
    stockData.length,
    stockData.thickness
  ])

  const costPerUnit = useCallback(
    //最小単位当たりの原価
    () => {
      if (!stockData?.cost || !stockData?.costPackageCount) return 0
      return Number(stockData.cost) * Number(stockData.costPackageCount)
    },
    [stockData.cost, stockData.costPackageCount]
  )

  const totalPrice = useCallback(() => {
    if (!stockData?.count) return 0
    const perUnit = costPerUnit()
    return perUnit * Number(stockData?.count)
  }, [stockData.count, costPerUnit])

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
      alert('材種は必須です。')
      return null
    }
    if (!woodSpeciesId || !woodSpeciesName) {
      alert('樹種は必須です。')
      return null
    }

    const validLength = checkValidLength(length)

    if (!validLength) {
      alert('長さは必須です。')
      console.error('checkValidStock validLength is null')
      return null
    }

    const { width, thickness, supplierId, supplierName } = data
    if (!width || !thickness || !supplierId) {
      console.error('checkValidStock width or thickness or supplierId is null')

      if (!width) {
        alert('幅は必須です。')
        return null
      }
      if (!thickness) {
        alert('厚みは必須です。')
        return null
      }
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
      cost,
      costUnitId,
      costUnitName
    } = data

    if (!packageCount) {
      alert('入数は必須です。')
      return null
    }
    if (!count) {
      alert('数量は必須です。')
      return null
    }
    if (!unitId || !unitName) {
      alert('単位は必須です。')
      return null
    }
    if (!warehouseId || !warehouseName) {
      alert('倉庫は必須です。')
      return null
    }
    if (!costPackageCount) {
      alert('原価単位数量は必須です。')
      return null
    }
    if (!cost) {
      alert('原価単位数量は必須です。')
      return null
    }
    if (!costUnitId || !costUnitName) {
      alert('原価単位は必須です。')
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
      thickness,
      length: validLength,
      width,
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
      cost,
      costUnitId,
      costUnitName,
      tempCount: count,
      enable
    }
  }
  const checkValidLength = (length: unknown): number | '乱尺' | null => {
    if (isFinite(Number(length))) {
      return Number(length)
    }

    if (typeof length === 'string' && length === '乱尺') {
      return '乱尺'
    }
    alert('長さは数字もしくは乱尺という文字列のみ許容します')
    return null
  }

  const useDemo = () => {
    setStockData(demoData)
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
    calcCostPackageCount,
    costPerUnit,
    totalPrice,
    fetchOrderSheet,
    postStock,
    useDemo
  }
}

export default useStock
