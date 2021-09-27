import { Item, History,  Supplier , GradeType, Unitype, WarehouseType, ReasonType } from "../entity/stock"
import { User } from "../entity/user"

interface Operator { value: unknown, operator: string}
interface UniversalOperator extends Operator { value: string| number, operator: "="|">"|"<"|">="|"<="}
interface InOperator extends Operator { value: string[]| number[] , operator: "in" }


export type Query<T> = {
  field: keyof T 
} & (UniversalOperator | InOperator)

export interface IRepositoryCommand<T>{
  create(entity:T): Promise<T | Error>
  update(id: number, entity:Partial<T>):Promise<T | Error>
}

export interface IRepositoryQuery<T>{
  findById(id: number): Promise<T | Error>
  findOne?(query:Query<T>|Query<T>[]): Promise<T | Error>
  findMany?(query:Query<T>|Query<T>[]):Promise<T[] | Error>
  findAll?():Promise<T[] | Error>
}

export type IRepository<T> = IRepositoryCommand<T> & IRepositoryQuery<T>

export type ItemRepository = IRepository<Item>
export type HisotryRepository = IRepository<History> & Required<Pick<IRepository<History>,"findMany">>
export type UserRepository = IRepository<User>
export type SupplierRepository = IRepository<Supplier>
export type GradeRepository = IRepository<GradeType>
export type UnitRepository = IRepository<Unitype>
export type WarehouseRepository = IRepository<WarehouseType>
export type ReasonRepository = IRepository<ReasonType>

