import { Item } from '@domain/entity/stock';

export type Methods = {
  get: {
    resBody: Item[],
    status: 200
  }
}