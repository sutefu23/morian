import { createItem } from '$/service/master/master'
import { defineController } from './$relay'
import { ItemService } from '$/domain/service/stock'
import { ItemRepository } from '$/domain/repository/prisma/item'

const itemService = new ItemService(new ItemRepository)


export default defineController(() => ({
  get: async ({params}) => {
    const item = await itemService.findItemById(params.itemId)
    if(item instanceof Error){
      console.error(item.message)
      return { status : 500, body: item}
    }
    return {
      status: 200, body: item
    }
  },
  post: async ({body}) => {
    const item = await itemService.createItem(body)
    if(item instanceof Error){
      console.error(item.message)
      return { status : 500, body: item}
    }
    return{
      status: 201,
      body: item
    }
  },
  patch: async ({body, params}) => {
    const item = await itemService.updateItem(params.itemId, body)
    if(item instanceof Error){
      console.error(item.message)
      return { status : 500, body: item}
    }
    return{
      status: 204,
      body: item
    }}
}))