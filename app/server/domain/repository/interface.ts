import {
  Item,
  History,
  Supplier,
  SupplierProps,
  GradeType,
  WoodSpeciesType,
  UnitType,
  WarehouseType,
  DeliveryPlaceType,
  ReasonType,
  ITEM_FIELD,
  ItemTypeType
} from '../entity/stock'
import { User, UserProps } from '../entity/user'
import { User as UserModel, Supplier as SupplierModel } from '@prisma/client'
import type { UpdateItemData, UpdateHistoryData } from '@domain/service/stock'
import type { ItemDTO } from '@domain/dto/item'
import type { HistoryDTO } from '@domain/dto/history'
interface Operator {
  value: unknown
  operator: string
}
interface UniversalOperator extends Operator {
  value: string | number
  operator: '=' | '>' | '<' | '>=' | '<=' | '!='
}
interface InOperator extends Operator {
  value: string[] | number[]
  operator: 'in'
}
interface NullOperator extends Operator {
  value: 'NULL'
  operator: 'is' | 'is Not'
}

export type Query<T> = {
  field: keyof T
} & (UniversalOperator | InOperator | NullOperator)

export interface IRepositoryCommand<Props, Entity> {
  create(entity: Props): Promise<Entity | Error>
  update(id: number, entity: Partial<Props>): Promise<Entity | Error>
  delete?(id: number): Promise<Entity | Error>
}

export interface IRepositoryQuery<Model, Entity> {
  findById(id: number): Promise<Entity | Error>
  findOne?(query: Query<Model> | Query<Model>[]): Promise<Entity | Error>
  findMany?(query: Query<Model> | Query<Model>[]): Promise<Entity[] | Error>
  findAll?(enable?: boolean): Promise<Entity[] | Error>
  filterName?(name: string): Promise<Entity[] | Error>
}

export type IRepository<Props, Model, Entity> = IRepositoryCommand<
  Props,
  Entity
> &
  IRepositoryQuery<Model, Entity>

export type IItemRepository = Required<
  IRepositoryCommand<UpdateItemData, Item>
> &
  Omit<IRepositoryQuery<ItemDTO, Item>, 'findMany'> &
  Required<Pick<IRepositoryQuery<ItemDTO, Item>, 'findMany'>> & {
    findByLotNo(lotNo: string): Promise<Item | null | Error>
  }
export type IHistoryRepository = Omit<
  IRepositoryCommand<HistoryDTO, History>,
  'create' | 'delete' | 'update'
> &
  Required<
    Pick<IRepositoryQuery<HistoryDTO, History>, 'findMany' | 'findById'>
  > & {
    create(
      entity: UpdateHistoryData,
      itemField: ITEM_FIELD
    ): Promise<History | Error>
    delete(
      id: number,
      entity: Required<Pick<UpdateHistoryData, 'itemId'>> &
        Partial<Pick<UpdateHistoryData, 'reduceCount' | 'addCount'>>,
      itemField: ITEM_FIELD
    ): Promise<[History, Item] | Error>
    update(
      id: number,
      entity: Partial<UpdateHistoryData>,
      itemField: ITEM_FIELD
    ): Promise<History | Error>
  }
export type IUserRepository = IRepositoryCommand<UserProps, User> &
  IRepositoryQuery<UserModel, User> &
  Required<Pick<IRepositoryQuery<UserModel, User>, 'findAll'>>
export type ISupplierRepository = Omit<
  IRepository<SupplierProps, SupplierModel, Supplier>,
  'findAll'
> &
  Required<
    Pick<
      IRepository<SupplierProps, SupplierModel, Supplier>,
      'findAll' | 'filterName'
    >
  >

export type IMasterRepository<Props> = IRepositoryCommand<Props, Props> &
  IRepositoryQuery<Props, Props>

export type IGradeRepository = Omit<IMasterRepository<GradeType>, 'findAll'> &
  Required<Pick<IMasterRepository<GradeType>, 'findAll'>>
export type IUnitRepository = Omit<IMasterRepository<UnitType>, 'findAll'> &
  Required<Pick<IMasterRepository<UnitType>, 'findAll'>>
export type IWarehouseRepository = Omit<
  IMasterRepository<WarehouseType>,
  'findAll'
> &
  Required<Pick<IMasterRepository<WarehouseType>, 'findAll'>>

export type IDeliveryPlaceRepository = Omit<
  IMasterRepository<DeliveryPlaceType>,
  'findAll'
> &
  Required<Pick<IMasterRepository<DeliveryPlaceType>, 'findAll'>>

export type IReasonRepository = Omit<IMasterRepository<ReasonType>, 'findAll'> &
  Required<Pick<IMasterRepository<ReasonType>, 'findAll'>>
export type ISpeciesRepository = Omit<
  IMasterRepository<WoodSpeciesType>,
  'findAll'
> &
  Required<Pick<IMasterRepository<WoodSpeciesType>, 'findAll'>>
export type IItemTypeRepository = Omit<
  IMasterRepository<ItemTypeType>,
  'findAll'
> &
  Required<Pick<IMasterRepository<ItemTypeType>, 'findAll'>>
