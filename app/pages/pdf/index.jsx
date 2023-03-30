import {
  PDFDownloadLink,
  PDFViewer,
  Page,
  Font,
  Text,
  View,
  Image,
  Document,
  StyleSheet
} from '@react-pdf/renderer'
import { Button } from '@chakra-ui/react'
import JsBarcode from 'jsbarcode'
import { useAspidaQuery } from '@aspida/react-query'
import { apiClient } from '~/utils/apiClient'

const MAX_PAGE_BARCODE_NUM = 30
export const BarCodePdf = () => {
  const { data: items } = useAspidaQuery(apiClient.itemList)
  if (!items) return <>データ取得中</>

  // ttfファイルのフォント定義
  Font.register({
    family: 'Nasu-Regular',
    src: '/fonts/Nasu-Regular.ttf'
  })

  const dataArray = items.map((item) => {
    const canvas = document.createElement('canvas')
    JsBarcode(canvas, item.lotNo, { format: 'code39' })
    const barcode = canvas.toDataURL()

    const size =
      (item.length ?? '') +
      (item.thickness ? `*${item.thickness}` : '') +
      (item.width ? `*${item.width}` : '')
    return {
      name: `${item.woodSpeciesName} ${item.itemTypeName}`,
      lotNo: item.lotNo,
      size: size ?? '',
      itemTypeId: item.itemTypeId,
      itemTypeName: item.itemTypeName,
      warehouseId: item.warehouseId,
      warehouseName: item.warehouseName,
      woodSpeciesId: item.woodSpeciesId,
      woodSpeciesName: item.woodSpeciesName,
      url: barcode
    }
  })

  // 倉庫と材種、樹種で並べ替え
  dataArray
    .sort(
      (prev, next) => Number(prev.woodSpeciesId) - Number(next.woodSpeciesId)
    )
    .sort((prev, next) => Number(prev.itemTypeId) - Number(next.itemTypeId))
    .sort((prev, next) => Number(prev.warehouseId) - Number(next.warehouseId))

  let pdfItems = [] //PDFでページ単位で出力しやすいようにグループ化
  for (let index = 0; index < dataArray.length; index++) {
    const { itemTypeName, warehouseName, woodSpeciesName } = dataArray[index]
    pdfItems[warehouseName] = pdfItems[warehouseName] || []
    pdfItems[warehouseName][itemTypeName] =
      pdfItems[warehouseName][itemTypeName] || []
    pdfItems[warehouseName][itemTypeName][woodSpeciesName] =
      pdfItems[warehouseName][itemTypeName][woodSpeciesName] || []
    pdfItems[warehouseName][itemTypeName][woodSpeciesName].push(
      dataArray[index]
    )
  }
  Font.register({
    family: 'Nasu-Bold',
    src: '/fonts/Nasu-Bold.ttf'
  })

  const styles = StyleSheet.create({
    body: {
      fontSize: '14px',
      padding: '20px',
      fontFamily: 'Nasu-Regular'
    },
    title: {
      fontSize: '12pt',
      fontFamily: 'Nasu-Regular',
      textAlign: 'center',
      marginBottom: '10px'
    },
    subtitle: {
      fontSize: '10pt',
      fontFamily: 'Nasu-Regular',
      textAlign: 'center',
      marginBottom: '10px'
    },
    text: { fontSize: '7pt', fontFamily: 'Nasu-Regular' },
    display: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap'
    },
    barcode: { width: '30%', height: 'auto', textAlign: 'center' }
  })
  const MyPDF = () => {
    return (
      <Document>
        {Object.keys(pdfItems).map((warehouseName) => (
          <Page size="A4" style={styles.body} wrap={false} key={warehouseName}>
            <Text style={styles.title}>{warehouseName}</Text>
            {Object.keys(pdfItems[warehouseName]).map((itemTypeName) => (
              <View key={itemTypeName}>
                <Text style={styles.subtitle}>{itemTypeName}</Text>
                {Object.keys(pdfItems[warehouseName][itemTypeName]).map(
                  (woodSpeciesName) => (
                    <View style={styles.display} key={woodSpeciesName}>
                      {pdfItems[warehouseName][itemTypeName][
                        woodSpeciesName
                      ].map((data, index) => (
                        <View
                          style={styles.barcode}
                          key={data.lotNo}
                          break={
                            index > 0 && index % MAX_PAGE_BARCODE_NUM === 0
                          }
                        >
                          <Image src={data.url} style={{ height: 50 }} />
                          <Text style={styles.text}>{data.name}</Text>
                          <Text style={styles.text}>{data.size}</Text>
                        </View>
                      ))}
                    </View>
                  )
                )}
              </View>
            ))}
          </Page>
        ))}
      </Document>
    )
  }

  return (
    <>
      <PDFDownloadLink document={<MyPDF />} fileName="barcode.pdf">
        <Button color="blue.300">クリックでPDFダウンロード</Button>
      </PDFDownloadLink>
      <PDFViewer width="80%">
        <MyPDF />
      </PDFViewer>
    </>
  )
}
export default BarCodePdf
