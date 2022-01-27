
import { useCallback, useState } from "react"
import { UpdateItemData } from "~/server/domain/service/stock"
import { Decimal } from "decimal.js"
import { Units } from "~/server/domain/init/master"
import { apiClient } from "~/utils/apiClient"
import { parseCookies } from "nookies"

export type EditUpdataItemData = Partial<UpdateItemData>

const defaultData = {
  enable:true,
}

const useStock = () => {
  const [ stockData, setStockData ] = useState<EditUpdataItemData>(defaultData)

  const updateField = useCallback(<K extends keyof UpdateItemData>(key: K, val: UpdateItemData[K]) :void => {
    setStockData({...stockData, ...{[key]:val}})
  }
  ,[stockData])

  const calcCostPackageCount = useCallback(() => {

    if ( stockData?.costUnitId 
          && stockData.width && stockData.thickness
          ){
      const { width, length, thickness } = stockData
      if (length === "乱尺" || !length) return

      const unit = Units.find((u) => u.id === stockData.costUnitId)?.name
      const costPackageCount = (() => {
        const thousand = new Decimal(1000)
        const tubo = new Decimal(3.3)
        const dWidth = new Decimal(width)
        const dLength = new Decimal(length)
        const dThickness = new Decimal(thickness)

        switch (unit) {
        case "㎥": // 幅/1000*長さ/1000*厚み/1000
          return dWidth.dividedBy(thousand).mul(dLength.dividedBy(thousand)).mul(dThickness.dividedBy(thousand))
        case "平米":// 幅/1000*長さ/1000
          return dWidth.dividedBy(thousand).mul(dLength.dividedBy(thousand))
        case "坪":// 幅/1000*長さ/1000/3.3
          return dWidth.dividedBy(thousand).mul(dLength.dividedBy(thousand)).dividedBy(tubo)

        default:
          break;
        }
        })()
        console.debug(costPackageCount)
        return costPackageCount
    }
  },[stockData.costUnitId, stockData.width, stockData.length, stockData.thickness])

  const costPerUnit = useCallback(//最小単位当たりの原価
    () => {
      if(!stockData?.cost || !stockData?.costPackageCount) return 0
      return Number(stockData.cost) * Number(stockData.costPackageCount)
    }
    ,[stockData.cost, stockData.costPackageCount])

  const totalPrice =  useCallback(
    () => {
      if(!costPerUnit() || !stockData?.count) return 0
      return costPerUnit() * Number(stockData?.count)
    }
    ,[stockData.count]
  )

  const checkValidStock = (data : EditUpdataItemData|undefined): UpdateItemData | null => {
    if(!data) {
      console.error("checkValidStock data is null")
      return null
    }

    const { lotNo, itemTypeId, woodSpeciesId, gradeId, length } = data
    if(!lotNo || !itemTypeId || !woodSpeciesId || !gradeId) {
      console.error("checkValidStock lotNo or itemTypeId or woodSpeciesId or gradeId is null")
      return null
    }
    const validLength = checkValidLength(length)

    if(!validLength){
      console.error("checkValidStock validLength is null")
      return null
    }

    const { width, thickness, supplierId} = data
    if(!width || !thickness || !supplierId ) {
      console.error("checkValidStock width or thickness or supplierId is null")
      return null
    }

    const { packageCount, count, unitId, warehouseId, manufacturer, costPackageCount, cost, costUnitId, tempCount} = data
    if(!packageCount || !count || !unitId ||  !warehouseId || !manufacturer || !costPackageCount || !cost || !costUnitId || !tempCount ) {
      console.error("checkValidStock packageCount or count or unitId or warehouseId or manufacturer or costPackageCount or cost or costUnitId or tempCount is null")
      return null
    }

    const { enable } = data
    if(!enable ) {
      console.error("checkValidStock enable is null")
      return null
    }

    return {
      ...data,
      lotNo, 
      itemTypeId, 
      woodSpeciesId, 
      gradeId, 
      thickness,
      length:validLength,
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
      tempCount,
      enable
    }
  }


  const checkValidLength = (length: unknown) :number | "乱尺" | null => {
    if(isFinite(Number(length))){
      return Number(length)
    }

    if(typeof (length) === "string" && length === "乱尺") {
      return "乱尺"
    }
    alert("長さは数字もしくは乱尺という文字列のみ許容します")
    return null
  }

  const postStock = useCallback(async () => {
    console.debug(stockData)
    const postStockData = checkValidStock(stockData)
    if(!postStockData) {
      console.error("postStockData is not valid")
      return true
    }
    const cookies = parseCookies()
    const res = await apiClient.stock.post({ body:postStockData, headers: {authorization: cookies.token}})
    if(res.status !== 201){
      console.error(res.body)
      alert("登録に失敗しました")
      return true
    }
    alert("登録しました")
    return true //遷移
  },[stockData])

  return { stockData, updateField, calcCostPackageCount, costPerUnit, totalPrice, postStock } 
}

export default useStock