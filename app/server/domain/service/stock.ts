
import { Item, History, Reason, ITEM_FIELD, 出庫理由, 入庫理由 } from "@domain/entity/stock"
import { ItemRepository, HisotryRepository, Query } from "@domain/repository/interface"
import { InvalidArgumentError, ValidationError } from "../type/error"
import { ItemToDTO  } from "../dto/item"
export class ItemService{
  private itemRepository: ItemRepository
  constructor(itemRepo: ItemRepository){
    this.itemRepository = itemRepo
  }
  async createItem(item: Item){
    const data = await this.itemRepository.create(item)
    if(data instanceof Error){
      return data as Error
    }
    const itemDto = ItemToDTO(data)
    return itemDto
  }

  async updateItem(id: number, item: Partial<Item>){
    const data = await this.itemRepository.update(id, item)
    if(data instanceof Error){
      return data as Error
    }
    
    return data
  }
  async findItemById(id:number){
    const data = await this.itemRepository.findById(id)
    if(data instanceof Error){
      return data as Error
    }
    if(!data.enable){
      return null
    }
    return data
  }
  async findManyItem(query: Query<Item>|Query<Item>[]){
    const data = await this.itemRepository.findMany(query)
    if(data instanceof Error){
      return data as Error
    }
    if(!Object.prototype.hasOwnProperty.call(query, "enable")){
      return data.filter(d => d.enable)
    }
    return data
  }
}


export class HistoryService{
  private historyRepository: HisotryRepository
  constructor(historyRepo: HisotryRepository){
    this.historyRepository = historyRepo
  }
  async createHistory(history: History){
    if(!history.reason) return new InvalidArgumentError("在庫理由は必須です。") 
    if(history.reason.name == 出庫理由.不良品 && !history.note){
      return new ValidationError("不良品の時は理由を備考に入れてください。")
    }
    const itemUpdateWith = this._whichItemField(history.reason.name)
    return await this.historyRepository.create(history, itemUpdateWith)
  }

  async updateHistory(id: number, history: Partial<History>){
    if(!history.reason) return new InvalidArgumentError("在庫理由は必須です。") 
    if(history.reason.name == 出庫理由.不良品 && !history.note){
      return new ValidationError("不良品の時は理由を備考に入れてください。")
    }

    const itemUpdateWith = this._whichItemField(history.reason.name)
    return await this.historyRepository.update(id, history, itemUpdateWith)
  }
  async getHistoryList(itemId: number){
    return await this.historyRepository.findMany({field:"itemId",value: itemId, operator:"="})
  }

  async findManyHistory(query: Query<History>|Query<History>[]){
    return await this.historyRepository.findMany(query)
  }

  async deleteHistory(historyId: number){
    const target = await this.historyRepository.findById(historyId)
    if(!target || target instanceof Error) return new InvalidArgumentError("在庫が存在しません。") 

    const itemUpdateWith = this._whichItemField(target.reason.name)
    return await this.historyRepository.delete(historyId, target, itemUpdateWith)
  }
  //どのITEMフィールドを同時に引落すべきか
  private _whichItemField(reason: Reason): ITEM_FIELD {
    
    switch (reason) {
      case 出庫理由.見積:
        return ITEM_FIELD.NONE//引落なし
      case 出庫理由.受注予約:  
        return ITEM_FIELD.TEMP_COUNT//仮在庫
      case 入庫理由.仕入, 出庫理由.受注出庫:
        return ITEM_FIELD.COUNT//実在庫
      case 出庫理由.不良品, 出庫理由.棚卸調整, 入庫理由.棚卸調整, 入庫理由.返品:
        return ITEM_FIELD.BOTH //両方
      default:
        return ITEM_FIELD.NONE
    }
  }
}