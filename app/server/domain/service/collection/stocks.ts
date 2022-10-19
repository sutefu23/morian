import moment from 'moment'
import { 出庫理由 } from "$/domain/entity/stock";
import { StockReason } from "$/domain/init/master";
import { RepositoryNotFoundError } from "$/domain/type/error";
import { ItemToDTO } from "../../dto/item";
import { IHistoryRepository, IItemRepository } from "../../repository/interface";

export class CollectionStockService{
  private historyRepository: IHistoryRepository
  private itemRepository:IItemRepository
  constructor(itemRepository:IItemRepository, hisotoryRepository:IHistoryRepository){
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

  // 受注予約一覧
  async getBookingStockList(){
    const bookHistories = await this.historyRepository.findMany({
      field: "bookUserId",
      operator: "is",
      value: "NULL",
    })
    if (bookHistories instanceof Error){
      return bookHistories as Error
    }
    const ids = bookHistories.map(h => h.itemId)
  }

  // 受注出庫一覧（当月）
  async getMonthOutStock(year:number, month: number){
    const reasonId = StockReason.find(r => r.name === 出庫理由.受注出庫)?.id
    const startDate = moment({year, month}).startOf('month')
    const endDate = moment({year, month}).endOf('month')
    if(!reasonId) return RepositoryNotFoundError
    const bookHistories = await this.historyRepository.findMany(
    [
      {
        field: "reasonId",
        operator: "=",
        value: reasonId,
      },
      {
        field: "date",
        operator: ">=",
        value: startDate.format("YYYY-MM-DD"),
      },
      {
        field: "date",
        operator: "<=",
        value: endDate.format("YYYY-MM-DD"),
      },
    ])
    if (bookHistories instanceof Error){
      return bookHistories as Error
    }
    return bookHistories
  }
  
  // 見積一覧
  async getEstimateList(){
    const reasonId = StockReason.find(r => r.name === 出庫理由.見積)?.id
    if(!reasonId) return RepositoryNotFoundError

    const estimateHistories = await this.historyRepository.findMany({
      field: "reasonId",
      operator: "=",
      value: reasonId,
    })
    if (estimateHistories instanceof Error){
      return estimateHistories as Error
    }
    return estimateHistories
  }

  // ロット別在庫金額

  
  // ロットNo / 樹種 / 分類 / 在庫金額
  // async lotSumStockList()

  // 分類別在庫金額
  
  // 倉庫別在庫金額
}