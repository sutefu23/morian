import { ValidationError, FieldNotFoundError } from "@domain/type/error";
import { ItemTypes, WoodSpecies } from "@domain/init/master"
import { Item as EntityItem, lotNoType, lengthType } from "@domain/entity/stock";
import { Item as PrismaItem } from "$prisma/client"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dbModelToEntity = async (model: PrismaItem): Promise<EntityItem | FieldNotFoundError | ValidationError> => {
  const lotNo = lotNoType.getInstance(model.lotNo)
    if(lotNo instanceof Error){
      throw lotNo
    }
    const itemType = ItemTypes.find(item => item.id === model.itemTypeId)
    if(!itemType){
      throw new FieldNotFoundError("itemTypeが見つかりません。")
    }

    const supplierId = model.supplierId
    if(!supplierId){
      throw new FieldNotFoundError("supplierIdが見つかりません。")
    }

    const woodSpecies = WoodSpecies.find(item => item.id === model.woodSpeciesId)
    if(!woodSpecies){
      throw new FieldNotFoundError("woodSpeciesIdが見つかりません。")
    }

    const grade = await prisma.grade.findUnique({
      where: {id: model.gradeId}
    })

    if(!grade){
      throw new FieldNotFoundError("gradeが見つかりません。")
    }

    const costUnit = await prisma.unit.findUnique({
      where: {id: model.costUnitId}
    })

    if(!costUnit){
      throw new FieldNotFoundError("costUnitが見つかりません。")
    }

    const unit = await prisma.unit.findUnique({
      where: {id: model.unitId}
    })

    if(!unit){
      throw new FieldNotFoundError("unitが見つかりません。")
    }

    const warehouse = await prisma.warehouse.findUnique({
      where: {id: model.warehouseId}
    })

    if(!warehouse){
      throw new FieldNotFoundError("warehouseが見つかりません。")
    }

    if(!model.spec){
      throw new FieldNotFoundError("specが見つかりません。")
    }
    const length = ((length) => {
      if(length){
        return lengthType.getInstance(length)
      }
    })(model.length)

    if(length instanceof Error){
      throw length
    }

    const width = model.width??undefined
    const thickness = model.thickness??undefined

    const newItem = {
      ...model,
      itemType: itemType,
      woodSpecies: woodSpecies,
      lotNo: lotNo,
      supplierId,
      length,
      width,
      thickness,
      grade,
      spec: model.spec,
      costUnit,
      unit,
      warehouse,
    }
    return newItem
  }