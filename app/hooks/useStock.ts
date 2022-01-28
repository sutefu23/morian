import React, { useCallback, useState } from 'react'
import { UpdateItemData } from '~/server/domain/service/stock'
import { Decimal } from 'decimal.js'
import { Units } from '~/server/domain/init/master'
import { apiClient } from '~/utils/apiClient'
import { parseCookies } from 'nookies'

export type EditUpdataItemData = Partial<UpdateItemData>

const defaultData = {
  lotNo: '',
  woodSpeciesId: null,
  itemTypeId: null,
  supplierId: null,
  gradeId: null,
  length: null,
  thickness: null,
  width: null,
  packageCount: new Decimal(0),
  warehouseId: null,
  arrivalExpectedDate: '',
  cost: new Decimal(0),
  costUnitId: null,
  count: new Decimal(0),
  unitId: null,
  costPackageCount: new Decimal(0),
  enable: true
}

const demoData = {
  lotNo: 'HM-15233',
  woodSpeciesId: 1,
  itemTypeId: 2,
  supplierId: 1,
  gradeId: 1,
  length: 5000,
  thickness: 50,
  width: 500,
  packageCount: new Decimal(10),
  warehouseId: 1,
  arrivalExpectedDate: '2月中旬',
  cost: new Decimal(100000),
  costUnitId: 1,
  count: new Decimal(10),
  unitId: 1,
  costPackageCount: new Decimal(0.125),
  enable: true
}

const useStock = () => {
  const [stockData, setStockData] = useState<EditUpdataItemData>(defaultData)

  const updateField = useCallback(
    <K extends keyof UpdateItemData>(key: K, val: UpdateItemData[K]): void => {
      setStockData({ ...stockData, ...{ [key]: val } })
    },
    [stockData]
  )

  const calcCostPackageCount = useCallback(() => {
    if (stockData?.costUnitId && stockData.width && stockData.thickness) {
      const { width, length, thickness } = stockData
      if (length === '乱尺' || !length) return

      const unit = Units.find((u) => u.id === stockData.costUnitId)?.name
      const costPackageCount = (() => {
        const thousand = new Decimal(1000)
        const tubo = new Decimal(3.3)
        const dWidth = new Decimal(width)
        const dLength = new Decimal(length)
        const dThickness = new Decimal(thickness)

        switch (unit) {
          case '㎥': // 幅/1000*長さ/1000*厚み/1000
            return dWidth
              .dividedBy(thousand)
              .mul(dLength.dividedBy(thousand))
              .mul(dThickness.dividedBy(thousand))
          case '平米': // 幅/1000*長さ/1000
            return dWidth.dividedBy(thousand).mul(dLength.dividedBy(thousand))
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

    const { lotNo, itemTypeId, woodSpeciesId, gradeId, length } = data
    if (!lotNo || !itemTypeId || !woodSpeciesId || !gradeId) {
      console.error(
        'checkValidStock lotNo or itemTypeId or woodSpeciesId or gradeId is null'
      )
      return null
    }
    const validLength = checkValidLength(length)

    if (!validLength) {
      console.error('checkValidStock validLength is null')
      return null
    }

    const { width, thickness, supplierId } = data
    if (!width || !thickness || !supplierId) {
      console.error('checkValidStock width or thickness or supplierId is null')
      return null
    }

    const {
      packageCount,
      count,
      unitId,
      warehouseId,
      costPackageCount,
      cost,
      costUnitId
    } = data

    if (
      !packageCount ||
      !count ||
      !unitId ||
      !warehouseId ||
      !costPackageCount ||
      !cost ||
      !costUnitId
    ) {
      console.error(
        'checkValidStock packageCount or count or unitId or warehouseId or costPackageCount or cost or costUnitId is null'
      )
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
      woodSpeciesId,
      gradeId,
      thickness,
      length: validLength,
      width,
      supplierId,
      packageCount,
      count,
      unitId,
      warehouseId,
      manufacturer,
      costPackageCount,
      cost,
      costUnitId,
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

  const postStock = useCallback(async () => {
    console.debug(JSON.stringify(stockData))
    const postStockData = checkValidStock(stockData)
    if (!postStockData) {
      console.error('postStockData is not valid')
      return true
    }
    const cookies = parseCookies()
    const res = await apiClient.stock.post({
      body: postStockData,
      headers: { authorization: cookies.token }
    })

    if (res.status !== 201) {
      console.error(res.body)
      alert('登録に失敗しました')
      return true
    }
    alert('登録しました')
    return true //遷移
  }, [stockData])

  return {
    stockData,
    updateField,
    calcCostPackageCount,
    costPerUnit,
    totalPrice,
    postStock,
    useDemo
  }
}

export default useStock
