import { PDFDownloadLink, PDFViewer, Page, Font, Text, View, Image, Document, StyleSheet } from '@react-pdf/renderer'
import {
  HStack,
  VStack,
  Box,
  InputGroup,
  InputLeftAddon,
  Input,
  Button,
} from '@chakra-ui/react'
import JsBarcode from 'jsbarcode'
import { useAspidaQuery } from '@aspida/react-query'
import { apiClient } from '~/utils/apiClient'
import { useState } from "react"
import dayjs from "dayjs"

const MAX_BARCODE_ROW_NUM = 9
export const BarCodePdf = () => {
  const [ registerDateQuery, setRegisterDateQuery] = useState({fromDate:undefined, toDate:undefined})
  const { data: items } = useAspidaQuery(apiClient.itemList, { query: {registerFrom: registerDateQuery.fromDate, registerTo: registerDateQuery.toDate} })


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

    const size = (item.length ?? '') + (item.thickness ? `*${item.thickness}` : '') + (item.width ? `*${item.width}` : '')
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
    .sort((prev, next) => Number(prev.woodSpeciesId) - Number(next.woodSpeciesId))
    .sort((prev, next) => Number(prev.itemTypeId) - Number(next.itemTypeId))
    .sort((prev, next) => Number(prev.warehouseId) - Number(next.warehouseId))

  const pdfItems = [] //PDFでページ単位で出力しやすいようにグループ化
  for (let index = 0; index < dataArray.length; index++) {
    const { itemTypeName, warehouseName, woodSpeciesName } = dataArray[index]
    pdfItems[warehouseName] = pdfItems[warehouseName] || []
    pdfItems[warehouseName][itemTypeName] = pdfItems[warehouseName][itemTypeName] || []
    pdfItems[warehouseName][itemTypeName][woodSpeciesName] = pdfItems[warehouseName][itemTypeName][woodSpeciesName] || []
    pdfItems[warehouseName][itemTypeName][woodSpeciesName].push(dataArray[index])
  }
  Font.register({
    family: 'Nasu-Bold',
    src: '/fonts/Nasu-Bold.ttf'
  })

  const styles = StyleSheet.create({
    body: {
      fontSize: '14px',
      padding: '50px',
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
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'left',
      flexWrap: 'wrap'
    },
    barcode: { width: '30%', height: 'auto', textAlign: 'center', marginBottom: '20px', marginLeft: '10px' }
  })
  const MyPDF = () => {
    return (
      <Document>
          {Object.keys(pdfItems).map((warehouseName) => {
          // 倉庫別
          let rowCount = 0 //バーコードの行をカウントして改ページ挿入するため
          return (
            <Page size="A4" style={styles.body} wrap={true} key={warehouseName}>
              <Text style={styles.title}>{warehouseName}</Text>
              {(registerDateQuery.fromDate || registerDateQuery.toDate) &&
                <Text style={styles.subtitle}>登録日：{`${dayjs(registerDateQuery.fromDate).format("YYYY-MM-DD")}～${dayjs(registerDateQuery.toDate).format("YYYY-MM-DD")}`}</Text>
              }
              {Object.keys(pdfItems[warehouseName]).map((itemTypeName) => {
                //材種別
                return (
                  <View key={itemTypeName}>
                    <Text style={styles.subtitle}>{itemTypeName}</Text>
                    {Object.keys(pdfItems[warehouseName][itemTypeName]).map((woodSpeciesName) => {
                      //樹種別
                      return (
                        <View style={styles.display} key={woodSpeciesName}>
                          {pdfItems[warehouseName][itemTypeName][woodSpeciesName].map((data, index) => {
                            rowCount = rowCount + (index % 3 === 0 ? 1 : 0)
                            return (
                              <View style={styles.barcode} key={data.lotNo} break={rowCount % MAX_BARCODE_ROW_NUM === 0}>
                                <Image src={data.url} style={{ height: 50 }} />
                                <Text style={styles.text}>{data.name}</Text>
                                <Text style={styles.text}>{data.size}</Text>
                              </View>
                            )
                          })}
                        </View>
                      )
                    })}
                  </View>
                )
              })}
            </Page>
          )
        })}
      </Document>
    )
  }

  return (
    <>
    <VStack align="left" pl="10">
        <HStack>
          <Box>
            <InputGroup>
              <InputLeftAddon
              >登録日で抽出</InputLeftAddon>
              <Input 
                type="date"
                value={registerDateQuery?.fromDate ? dayjs(registerDateQuery?.fromDate).format('YYYY-MM-DD'): undefined}
                onChange={(e) => { 
                  setRegisterDateQuery({...registerDateQuery, fromDate:e.target.valueAsDate ?? undefined})
                }}
                ></Input>
                <InputLeftAddon
              >～</InputLeftAddon>
              <Input 
                type="date"
                value={registerDateQuery?.toDate ? dayjs(registerDateQuery?.toDate).format('YYYY-MM-DD'): undefined}
                onChange={(e) => { 
                  setRegisterDateQuery({...registerDateQuery, toDate:e.target.valueAsDate ?? undefined})
                }}
                />
            </InputGroup>
          </Box>
        </HStack>
        <HStack pt={10} mb={10}>
      <PDFDownloadLink document={<MyPDF />} fileName="barcode.pdf">
        <Button color="blue.300">クリックでPDFダウンロード</Button>
      </PDFDownloadLink>
        </HStack>
         </VStack>
    </>
  )
}
export default BarCodePdf
