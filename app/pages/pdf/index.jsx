import React from 'react';
import { PDFDownloadLink, PDFViewer, Page, Font, Text, View, Image, Document, StyleSheet } from '@react-pdf/renderer';
import { Button } from '@chakra-ui/react';
import JsBarcode from 'jsbarcode'
import { useAspidaQuery } from '@aspida/react-query';
import { apiClient } from '~/utils/apiClient';

const MAX_PAGE_BARCODE_NUM = 30
export const BarCodePdf = () => {
  const {data: items} = useAspidaQuery(apiClient.itemList,{query:{notZero:true}})
  if(!items) return <>データ取得中</>

  // ttfファイルのフォント定義
  Font.register({
    family: 'Nasu-Regular',
    src: './fonts/Nasu-Regular.ttf'
  });

  const dataArray = items.map((item) => {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, item.lotNo, {format:"code39"});
    const barcode = canvas.toDataURL();

    const size = (item.length ?? '') + (item.thickness ? `*${item.thickness}` : '') + (item.width ? `*${item.width}`:'')
    return {
      name: `${item.woodSpeciesName} ${item.itemTypeName}`,
      size: size ?? '',
      url:barcode
    }
  })


  Font.register({
    family: 'Nasu-Bold',
    src: "./fonts/Nasu-Bold.ttf"
  });

  const styles = StyleSheet.create({
    body: {
      fontSize: '14px',
      padding:"20px",
      fontFamily: 'Nasu-Regular',
    },
    title: { fontSize: '12pt', fontFamily: 'Nasu-Regular', textAlign:"center", marginBottom:"10px" },
    subtitle: { fontSize: '10pt', fontFamily: 'Nasu-Regular', textAlign:"center", marginBottom:"10px" },
    text: { fontSize: '7pt', fontFamily: 'Nasu-Regular' },
    display: { flexDirection: 'row',justifyContent:'space-between',flexWrap:'wrap'},
    barcode: { width: '30%', height:'auto', textAlign:"center"},
  });

  const MyPDF = () => {
    return (
      <Document>
        <Page size="A4" style={styles.body} wrap={false}>
            <Text style={styles.title}>倉庫名など</Text>
            <Text style={styles.subtitle}>樹種名など</Text>
            <View style={styles.display}>
            {
              dataArray.map((data, index) => (
                <View style={styles.barcode} key={data.name} break={index > 0 && index % MAX_PAGE_BARCODE_NUM===0}>
                <Image src={data.url} style={{height:50}}/>
                <Text style={styles.text}>{data.name}</Text>
                <Text style={styles.text}>{data.size}</Text>
                </View>
              ))
            }
            </View>
        </Page>
      </Document>
    )
  }

  return (
    <>
      <PDFDownloadLink document={<MyPDF />} fileName="barcode.pdf">
        <Button color="blue.300">
        クリックでPDFダウンロード
        </Button>
      </PDFDownloadLink>
      <PDFViewer width="80%">
        <MyPDF />
      </PDFViewer>
    </>
  );
};
export default BarCodePdf