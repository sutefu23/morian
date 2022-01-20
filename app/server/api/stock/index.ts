import { AuthHeader } from '$/types';
import { ItemDTO } from '@domain/dto/item'
import { Query } from '$/domain/repository/interface';

export type Methods = {
  get: {
    query:  Query<ItemDTO>|Query<ItemDTO>[],
    resBody: ItemDTO[],
    status: 200
  },
  post: {
    reqHeaders: AuthHeader
    reqBody:ItemDTO
    resBody: ItemDTO
    status: 201
  },
}