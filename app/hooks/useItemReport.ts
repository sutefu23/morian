import ExcelJS from 'exceljs'
import '../utils/number'
import { apiClient } from '~/utils/apiClient'
export type ReportType = '不良在庫一覧' | 'ロット別在庫金額'

const useItemReport = (type: ReportType, query?: { fromDate?: Date; toDate?: Date; itemTypeId?: number; woodSpeciesId?: number }) => {
  const print = async () => {
    const param = (() => {
      const { fromDate, toDate, itemTypeId, woodSpeciesId } = query || {}
      switch (type) {
        case '不良在庫一覧':
          return { notZero: true, isDefective: true }
        case 'ロット別在庫金額':
          return { notZero: true, registerFrom: fromDate, registerTo: toDate, itemTypeId: itemTypeId, woodSpeciesId: woodSpeciesId }
      }
    })()

    const items = await apiClient.itemList.$get({ query: param })
    const workbook = new ExcelJS.Workbook()
    workbook.addWorksheet(`${type}`)
    const worksheet = workbook.getWorksheet(`${type}`)
    // 列を定義
    if (!worksheet) return
    worksheet.columns = [
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
      { header: '倉庫', key: 'warehouseName' },
      { header: '原価', key: 'cost' },
      { header: '入数', key: 'packageCount' },
      { header: '入数単位', key: 'packageCountUnitName' },
      { header: '原価単位数量', key: 'costPackageCount' },
      { header: '数量', key: 'count' },
      { header: '単位', key: 'unitName' },
      { header: '金額', key: 'totalAmount' },
      { header: 'ロット備考', key: 'note' }
      // { header: '明細備考', key: 'detailnote' }
    ]
    if (!worksheet) return
    worksheet.columns = (() => {
      switch (type) {
        case '不良在庫一覧':
          return [...worksheet.columns, ...[{ header: '不良品備考', key: 'defectiveNote' }]]
        case 'ロット別在庫金額':
          return [...worksheet.columns, ...[]]
      }
    })()
    // 行を定義
    items?.map((item) => {
      const cost = `${Number(item.cost ?? 0).toYenFormat()}/${item.costUnitName}`
      const totalAmount = Number(item.cost ?? 0) * Number(item.costPackageCount ?? 0) * Number(item.count ?? 0)
      worksheet.addRow({
        ...item,
        length: item.length ? Number(item.length ?? 0) : '',
        thickness: item.thickness ? Number(item.thickness ?? 0) : '',
        width: item.width ? Number(item.width ?? 0) : '',
        totalAmount: totalAmount.toYenFormat(),
        packageCount: Number(item.packageCount ?? 0),
        costPackageCount: Number(item.costPackageCount ?? 0),
        count: Number(item.count ?? 0),
        cost
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

  return {
    print
  }
}
export default useItemReport
