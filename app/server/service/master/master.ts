import { PrismaClient } from '@prisma/client'
import type { Item, Unit, Supplier, ItemType, Species, Warehouse, Reason, Prisma } from '$prisma/client'

const prisma = new PrismaClient()

// 商品マスタ
export const createItem = (data:Prisma.ItemCreateInput) => {
  return prisma.item.create(
    {data}
  )
}

export const updateItem = 
async (id: Item['id'], partialItem: Prisma.ItemUpdateInput) => {
  prisma.item.update({ where: { id }, data: partialItem })
}

// 単位
export const createUnit = (data:Prisma.UnitCreateInput) => {
  prisma.unit.create(
    {data}
  )
}

export const updateUnit = 
async (id: Unit['id'], partialUnit: Prisma.UnitUpdateInput) => {
  prisma.unit.update({ where: { id }, data: partialUnit })
}

export const fetchUnits = async () => {
  prisma.unit.findMany()
}

// 仕入先
export const createSupplier = (data:Prisma.SupplierCreateInput) => {
  prisma.supplier.create(
    {data}
  )
}

export const updateSupplier = 
async (id: Supplier['id'], partialSupplier: Prisma.SupplierUpdateInput) => {
  prisma.supplier.update({ where: { id }, data: partialSupplier })
}

// 材種
export const createItemType = (data:Prisma.ItemTypeCreateInput) => {
  prisma.itemType.create(
    {data}
  )
}

export const updateItemType = 
async (id: ItemType['id'], partialItemType: Prisma.ItemTypeUpdateInput) => {
  prisma.itemType.update({ where: { id }, data: partialItemType })
}

// 樹種
export const createSpecies = (data:Prisma.SpeciesCreateInput) => {
  prisma.species.create(
    {data}
  )
}

export const updateSpecies = 
async (id: Species['id'], partialSpecies: Prisma.SpeciesUpdateInput) => {
  prisma.species.update({ where: { id }, data: partialSpecies })
}

// 樹種
export const createWarehouse = (data:Prisma.WarehouseCreateInput) => {
  prisma.warehouse.create(
    {data}
  )
}

export const updateWarehouse = 
async (id: Warehouse['id'], partialWarehouse: Prisma.WarehouseUpdateInput) => {
  prisma.warehouse.update({ where: { id }, data: partialWarehouse })
}


// 倉庫
export const createReason = (data:Prisma.ReasonCreateInput) => {
  prisma.reason.create(
    {data}
  )
}

export const updateReason = 
async (id: Reason['id'], partialReason: Prisma.ReasonUpdateInput) => {
  prisma.reason.update({ where: { id }, data: partialReason })
}
