import ExcelJS from 'exceljs'
import { apiClient } from '~/utils/apiClient'
import { StockReason } from '~/server/domain/init/master'
import { 出庫理由 } from '~/server/domain/entity/stock'
import dayjs from 'dayjs'
export type ReportType = '受注予約一覧' | '受注出庫一覧' | '見積一覧'

const useHistoryReport = (type: ReportType, fromDate?: Date, toDate?: Date) => {
  const print = async () => {
    const query = (() => {
      switch (type) {
        case '受注予約一覧':
          return {
            reasonId: StockReason.find((r) => r.name === 出庫理由.受注予約)?.id
          }
        case '受注出庫一覧':
          if (!fromDate || !toDate) {
            return
          }
          return {
            fromDate,
            toDate,
            reasonId: StockReason.find((r) => r.name === 出庫理由.受注出庫)?.id
          }
        case '見積一覧':
          return {
            reasonId: StockReason.find((r) => r.name === 出庫理由.見積)?.id
          }
      }
    })()
    if (!query) return
    const items = await apiClient.historyList.$get({ query })
    const workbook = new ExcelJS.Workbook()
    workbook.addWorksheet(`${type}`)
    const worksheet = workbook.getWorksheet(`${type}`)

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
      { header: '入数', key: 'packageCount' },
      { header: '入数単位', key: 'packageCountUnitName' },
      { header: '数量', key: 'reduceCount' },
      { header: '単位', key: 'unitName' },
      { header: '倉庫', key: 'warehouseName' },
      { header: '備考', key: 'note' }
    ]

    worksheet.columns = (() => {
      switch (type) {
        case '受注予約一覧':
          return [
            ...worksheet.columns,
            ...[
              { header: '予約者', key: 'bookUserName' },
              { header: '予約期限', key: 'bookDate' }
            ]
          ]
        case '受注出庫一覧':
          return [...worksheet.columns, ...[]]
        case '見積一覧':
          return [
            ...worksheet.columns,
            ...[
              { header: '見積者', key: 'bookUserName' },
              { header: '見積期限', key: 'bookDate' }
            ]
          ]
      }
    })()

    // 行を定義
    items.forEach((item) => {
      item.history.map((h) => {
        const date = dayjs(h.date).format('YYYY-MM-DD')
        const bookDate = dayjs(h.bookDate).format('YYYY-MM-DD')
        worksheet.addRow({
          ...item,
          length: item.length ? Number(item.length ?? 0) : '',
          thickness: item.thickness ? Number(item.thickness ?? 0) : '',
          width: item.width ? Number(item.width ?? 0) : '',
          packageCount: Number(item.packageCount ?? 0),
          ...h,
          reduceCount: Number(h.reduceCount ?? 0),
          date,
          bookDate
        })
      })
    })

    const uint8Array = await workbook.xlsx.writeBuffer()
    const blob = new Blob([uint8Array], { type: 'application/octet-binary' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${type}.xlsx`
    a.click()
    a.remove()
  }

  return { print }
}

export default useHistoryReport
