import { useAspidaQuery } from '@aspida/react-query';
import ExcelJS from 'exceljs'
import { apiClient } from '~/utils/apiClient';
import { StockReason } from '~/server/domain/init/master';
import { 出庫理由 } from '~/server/domain/entity/stock';
import dayjs from 'dayjs';
export type ReportType = 
  '受注予約一覧' |
  '受注出庫一覧' |
  '見積一覧'

const useHistoryReport = (type: ReportType, fromDate?:Date, toDate?: Date) => {
  const res = (() => {
    switch(type){
      case "受注予約一覧":
        return useAspidaQuery(apiClient.historyList,{query:{reasonId: StockReason.find(r => r.name === 出庫理由.受注予約)?.id}})
      case "受注出庫一覧":
        if(!fromDate || !toDate){
          return 
        }
        return useAspidaQuery(apiClient.historyList,{query:{fromDate, toDate, reasonId: StockReason.find(r => r.name === 出庫理由.受注出庫)?.id}})  
      case "見積一覧":
        return useAspidaQuery(apiClient.historyList,{query:{reasonId: StockReason.find(r => r.name === 出庫理由.見積)?.id}})
    }
  })()

  const print = async () => {
    if(!res) return
    const {data: item} = res

    const workbook = new ExcelJS.Workbook();
    workbook.addWorksheet(`${type}`);
    const worksheet = workbook.getWorksheet(`${type}`);
  
    // 列を定義
    worksheet.columns = [
      { header: '日付', key: 'date' },
      { header: 'ロットNo', key: 'lotNo' },
      { header: '樹種', key: 'woodSpeciesName' },
      { header: '分類', key: 'itemTypeName' },
      { header: 'グレード', key: 'gradeName' },
      { header: '仕様', key: 'spec' },
      { header: '製造元', key: 'manufacturer' },
      { header: '仕入元', key: 'supplierName' },
      { header: '長', key: 'length' },
      { header: '厚', key: 'thickness' },
      { header: '幅', key: 'width' },
      { header: '数量', key: 'reduceCount' },
      { header: '単位', key: 'unitName' },
      { header: '倉庫', key: 'warehouseName' },
      { header: '備考', key: 'note' },
    ]
  
    worksheet.columns = (() => {
      switch(type){
        case "受注予約一覧":
          return [...worksheet.columns,...[{header:'予約者', key:'bookUserName'},{header:'予約期限', key:'bookDate'}]]
        case "受注出庫一覧":
          return [...worksheet.columns,...[]]
        case "見積一覧":
          return [...worksheet.columns,...[{header:'見積者', key:'bookUserName'},{header:'見積期限', key:'bookDate'}]]
      }
    })()
  
    // 行を定義
    item?.history?.map(history => {
      const date = dayjs(history.date).format("YYYY-MM-DD")
      const bookDate = dayjs(history.bookDate).format("YYYY-MM-DD")
      worksheet.addRow({...item, ...history, date, bookDate});
    })
    
    const uint8Array = await workbook.xlsx.writeBuffer();
    const blob = new Blob([uint8Array], {type: 'application/octet-binary'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}.xlsx`;
    a.click();
    a.remove();  
  }

  return { print }
}


export default useHistoryReport