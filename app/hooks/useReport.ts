import { useAspidaQuery } from '@aspida/react-query';
import ExcelJS from 'exceljs'
import { apiClient } from '~/utils/apiClient';

const ReportType = [
    {key:'DefectiveList',name: '不良在庫一覧'},
    {key:'BookList',name: '受注予約一覧'},
    {key:'OrderMonthList',name: '受注出庫一覧（前月）'},
    {key:'OrderCurMonthList',name: '受注出庫一覧（当月）'},
    {key:'EstimateList"',name: '見積一覧'},
  ] as const

const useReport = async (type: typeof ReportType["name"]) => {
  const data = useAspidaQuery(apiClient.historyList,{query:{}})  
  // Workbookの作成
  const workbook = new ExcelJS.Workbook();
  // Workbookに新しいWorksheetを追加
  workbook.addWorksheet('My Sheet');
  // ↑で追加したWorksheetを参照し変数に代入
  const worksheet = workbook.getWorksheet('My Sheet');

  // 列を定義
  worksheet.columns = [
    { header: 'ID', key: 'id' },
    { header: '氏名', key: 'name' },
    { header: '価格', key: 'price' },
  ];

  // 行を定義
  worksheet.addRow({id: 1001, name: 'ハンバーガー', price: 170});
  worksheet.addRow({id: 1002, name: 'チーズバーガー', price: 200});
  worksheet.addRow({id: 1003, name: '照り焼きチキンバーガー', price: 260});
  
  // UInt8Arrayを生成
  const uint8Array = await workbook.xlsx.writeBuffer();
  // Blobを生成
  const blob = new Blob([uint8Array], {type: 'application/octet-binary'});
  // DL用URLを生成し、aタグからダウンロードを実行
  const url = window.URL.createObjectURL(blob);
  // aタグを生成
  const a = document.createElement('a');
  // aタグのURLを設定
  a.href = url;
  // aタグにdownload属性を付け、URLがダウンロード対象になるようにします
  a.download = `price_list.xlsx`;
  // aタグをクリックさせます
  a.click();
  // ダウンロード後は不要なのでaタグを除去
  a.remove();  
}

export default useReport