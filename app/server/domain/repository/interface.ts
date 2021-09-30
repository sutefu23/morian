import { Item, History,  Supplier , GradeType, UnitType, WarehouseType, ReasonType, ITEM_FIELD } from "../entity/stock"
import { User } from "../entity/user"

interface Operator { value: unknown, operator: string}
interface UniversalOperator extends Operator { value: string| number, operator: "="|">"|"<"|">="|"<="|"!="}
interface InOperator extends Operator { value: string[]| number[] , operator: "in" }
interface NullOperator extends Operator  { value: "NULL", operator: "is"| "is Not"}

export type Query<T> = {
  field: keyof T 
} & (UniversalOperator | InOperator | NullOperator)

export interface IRepositoryCommand<T>{
  create(entity:T): Promise<T | Error>
  update(id: number, entity:Partial<T>):Promise<T | Error>
}

export interface IRepositoryQuery<T>{
  findById(id: number): Promise<T | Error>
  findOne?(query:Query<T>|Query<T>[]): Promise<T | Error>
  findMany?(query:Query<T>|Query<T>[]):Promise<T[] | Error>
  delete?(id:number):Promise<T | Error>
  findAll?():Promise<T[] | Error>
}

export type IRepository<T> = IRepositoryCommand<T> & IRepositoryQuery<T>

export type ItemRepository =  Omit<IRepository<Item>,'findMany'> & Required<Pick<IRepository<Item>, 'findMany'>>
export type HisotryRepository = Omit<IRepository<History>,"create"|"delete"|"update"> & Required<Pick<IRepository<History>,"findMany">> & {
  create(entity: History, itemField: ITEM_FIELD):Promise<History|Error>
  delete(id: number, entity: Required<Pick<History, 'itemId'>> & Partial<Pick<History, 'reduceCount'|'addCount'>>, itemField: ITEM_FIELD):Promise<[History, Item]|Error>
  update(id: number, entity: Partial<History>, itemField: ITEM_FIELD):Promise<History|Error>}
export type UserRepository = IRepository<User>
export type SupplierRepository = Omit<IRepository<Supplier>,'findAll'> & Required<Pick<IRepository<Supplier>, 'findAll'>>
export type GradeRepository = Omit<IRepository<GradeType>,'findAll'> & Required<Pick<IRepository<GradeType>, 'findAll'>>
export type UnitRepository = Omit<IRepository<UnitType>,'findAll'> & Required<Pick<IRepository<UnitType>, 'findAll'>>
export type WarehouseRepository = Omit<IRepository<WarehouseType>,'findAll'> & Required<Pick<IRepository<WarehouseType>, 'findAll'>>
export type ReasonRepository = Omit<IRepository<ReasonType>,'findAll'> & Required<Pick<IRepository<ReasonType>, 'findAll'>>


