
import { Item, History } from "@domain/entity/stock"
import { ItemRepository, HisotryRepository } from "@domain/repository/interface"
export class ItemService{
  private itemRepository: ItemRepository
  constructor(itemRepo: ItemRepository){
    this.itemRepository = itemRepo
  }
  async createItem(item: Item){
    return await this.itemRepository.create(item)
  }

  async findItemById(id:number){
    return await this.itemRepository.findById(id)
  }
}

export class HistoryService{
  private historyRepository: HisotryRepository
  constructor(historyRepo: HisotryRepository){
    this.historyRepository = historyRepo
  }
  async createHistory(history: History){
   return await this.historyRepository.create(history)
  }

  async updateHistory(id: number, history: Partial<History>){
    return await this.historyRepository.update(id, history)
  }

  async getHistoryList(itemId: number){
    return await this.historyRepository.findMany({field:"itemId",value: itemId, operator:"="})
  }
}