
export interface IRepositoryCommand<T>{
  create(entity:T): T
  update(entity:Partial<T>):T
}

export interface IRepositoryQuery<Query, T>{
  findOne(query:Query): T
  findMany(query:Query):T[]
}
