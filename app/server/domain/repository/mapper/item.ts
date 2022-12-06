import { ValidationError, FieldNotFoundError } from '@domain/type/error'
import { ItemTypes, WoodSpecies } from '@domain/init/master'
import {
  Item as EntityItem,
  lotNoType,
  lengthType,
  Supplier
} from '@domain/entity/stock'
import { Item as PrismaItem } from '$prisma/client'
import { PrismaClient } from '@prisma/client'
import { Decimal } from 'decimal.js'

const prisma = new PrismaClient()

export const dbModelToEntity = async (
  model: PrismaItem
): Promise<EntityItem | FieldNotFoundError | ValidationError> => {
  const lotNo = lotNoType.getInstance(model.lotNo)
  if (lotNo instanceof Error) {
    throw lotNo
  }
  const itemType = ItemTypes.find((item) => item.id === model.itemTypeId)
  if (!itemType) {
    throw new FieldNotFoundError('itemTypeが見つかりません。')
  }

  const supplierId = model.supplierId
  if (!supplierId) {
    throw new FieldNotFoundError('supplierIdが見つかりません。')
  }
  const supplierName = (() => {
    if (supplierId && !model.supplierName) {
      prisma.supplier.findUnique({
        where: { id: supplierId }
      })
    } else {
      return model.supplierName
    }
  })()
  if (!supplierName) {
    throw new FieldNotFoundError('supplierNameが見つかりません。')
  }

  const woodSpecies = WoodSpecies.find(
    (item) => item.id === model.woodSpeciesId
  )
  if (!woodSpecies) {
    throw new FieldNotFoundError('woodSpeciesIdが見つかりません。')
  }

  const grade =
    (await prisma.grade.findUnique({
      where: { id: model.gradeId ?? undefined }
    })) ?? undefined

  const costUnit = await (async () => {
    if (model.costUnitId) {
      return await prisma.unit.findUnique({
        where: { id: model.costUnitId }
      })
    }
  })()

  const unit = await prisma.unit.findUnique({
    where: { id: model.unitId }
  })

  if (!unit) {
    throw new FieldNotFoundError('unitが見つかりません。')
  }

  const warehouse = await prisma.warehouse.findUnique({
    where: { id: model.warehouseId }
  })

  if (!warehouse) {
    throw new FieldNotFoundError('warehouseが見つかりません。')
  }

  const length = ((length) => {
    if (length) {
      return lengthType.getInstance(length)
    }
  })(model.length)

  if (length instanceof Error) {
    throw length
  }

  const count = new Decimal(model.count.toString())
  const tempCount = new Decimal(model.tempCount.toString())

  const issueItemId = model.issueItemId ?? undefined
  const arrivalDate = model.arrivalDate ?? undefined
  const width = model.width ?? undefined
  const thickness = model.thickness ?? undefined
  const manufacturer = model.manufacturer ?? undefined
  const note = model.note ?? undefined
  const defectiveNote = model.defectiveNote ?? undefined

  const newItem = {
    ...model,
    issueItemId,
    cost: model.cost ? new Decimal(model.cost.toString()) : undefined,
    packageCount: model.packageCount
      ? new Decimal(model.packageCount.toString())
      : undefined,
    costPackageCount: model.costPackageCount
      ? new Decimal(model.costPackageCount.toString())
      : undefined,
    count,
    tempCount,
    itemType: itemType,
    arrivalDate,
    woodSpecies: woodSpecies,
    lotNo: lotNo,
    supplierId,
    supplierName,
    length,
    width,
    thickness,
    grade,
    spec: model.spec ?? undefined,
    costUnit: costUnit ?? undefined,
    unit,
    warehouse,
    manufacturer,
    note,
    defectiveNote
  }
  return newItem
}
