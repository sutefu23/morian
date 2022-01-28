import { defineController } from './$relay'
import { ItemService } from '$/domain/service/stock'
import { ItemRepository } from '$/domain/repository/prisma/item'

const itemService = new ItemService(new ItemRepository)


export default defineController(() => ({
  get: async ({query}) => {
    const item = await itemService.findManyItem(query)

    if(item instanceof Error){
      console.error(item)
      return { status : 400, body: item}
    }
    return {
      status: 200, body: item
    }
  },
  post: async ({body}) => {
    try{
      const item = await itemService.createItem(body)
      if(item instanceof Error){
        console.error(item.message)
        return { status : 403, body: item}
      }  
      return{
        status: 201,
        body: item
      }  
    }catch(e: unknown){
      console.error(e)
      return { status : 403, body: e}
    }
  }
}))