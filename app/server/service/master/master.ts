import { PrismaClient } from '@prisma/client'
import type { Item, Unit, Supplier, ItemType, Species, Warehouse, Reason, Prisma } from '$prisma/client'

const prisma = new PrismaClient()

// 商品マスタ
export const createItem = async (data:Prisma.ItemCreateInput) => {
  return await prisma.item.create(
    {data}
  )
}

export const updateItem = 
async (id: Item['id'], partialItem: Prisma.ItemUpdateInput) => {
  return await prisma.item.update({ where: { id }, data: partialItem })
}

// 単位
export const createUnit = async (data:Prisma.UnitCreateInput) => {
  return await prisma.unit.create(
    {data}
  )
}

export const updateUnit = 
async (id: Unit['id'], partialUnit: Prisma.UnitUpdateInput) => {
  return await prisma.unit.update({ where: { id }, data: partialUnit })
}

export const fetchUnits = async () => {
  return await prisma.unit.findMany()
}

// 仕入先
export const createSupplier = async (data:Prisma.SupplierCreateInput) => {
  return await prisma.supplier.create(
    {data}
  )
}

export const updateSupplier = 
async (id: Supplier['id'], partialSupplier: Prisma.SupplierUpdateInput) => {
  return await prisma.supplier.update({ where: { id }, data: partialSupplier })
}

// 材種
export const createItemType = async (data:Prisma.ItemTypeCreateInput) => {
  return await prisma.itemType.create(
    {data}
  )
}

export const updateItemType = 
async (id: ItemType['id'], partialItemType: Prisma.ItemTypeUpdateInput) => {
  return await prisma.itemType.update({ where: { id }, data: partialItemType })
}

// 樹種
export const createSpecies = async (data:Prisma.SpeciesCreateInput) => {
  return await prisma.species.create(
    {data}
  )
}

export const updateSpecies = 
async (id: Species['id'], partialSpecies: Prisma.SpeciesUpdateInput) => {
  return await prisma.species.update({ where: { id }, data: partialSpecies })
}

// 樹種
export const createWarehouse = async (data:Prisma.WarehouseCreateInput) => {
  return await prisma.warehouse.create(
    {data}
  )
}

export const updateWarehouse = 
async (id: Warehouse['id'], partialWarehouse: Prisma.WarehouseUpdateInput) => {
  return await prisma.warehouse.update({ where: { id }, data: partialWarehouse })
}


// 倉庫
export const createReason = async (data:Prisma.ReasonCreateInput) => {
  return await prisma.reason.create(
    {data}
  )
}

export const updateReason = 
async (id: Reason['id'], partialReason: Prisma.ReasonUpdateInput) => {
  return await prisma.reason.update({ where: { id }, data: partialReason })
}
