import { ItemToDTO } from "../dto/item";
import { HisotryRepository, ItemRepository } from "../repository/interface";

export class ReportService{
  private historyRepository: HisotryRepository
  private itemRepository:ItemRepository
  constructor(itemRepository:ItemRepository, hisotoryRepository:HisotryRepository){
    this.historyRepository = hisotoryRepository
    this.itemRepository = itemRepository

  }
  ///不良在庫一覧
  async getDefectiveStockList(){
    const items = await this.itemRepository.findMany({
      field: 'defectiveNote',
      operator : "is Not",
      value : "NULL"
    })
    if(items instanceof Error){
      return items
    }
    return items.map(i => ItemToDTO(i))
  }
}