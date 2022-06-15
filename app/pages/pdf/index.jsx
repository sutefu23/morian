import React from 'react';
import { PDFDownloadLink, PDFViewer, Page, Font, Text, View, Image, Document, StyleSheet } from '@react-pdf/renderer';
import JsBarcode from 'jsbarcode'
import { useAspidaQuery } from '@aspida/react-query';
import { apiClient } from '~/utils/apiClient';

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
    JsBarcode(canvas, item.lotNo);
    const barcode = canvas.toDataURL();

    return {
      name: `${item.woodSpeciesName} ${item.itemTypeName}`,
      size: `${item.length}x${item.thickness}x${item.width}`,
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
    display: { flexDirection: 'row',justifyContent:'space-between'},
    barcode: { width: '100px', height:'auto', textAlign:"center"},
  });

  const MyPDF = () => {
    return (
      <Document>
        <Page size="A4" style={styles.body}>
            <Text style={styles.title}>倉庫名など</Text>
            <Text style={styles.subtitle}>樹種名など</Text>
            <View style={styles.display}>
            {
              dataArray.map((data) => (
                <View style={styles.barcode}>
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
      {({loading}) => (loading ? 'Loading document...' : 'クリックでPDFダウンロード')}
      </PDFDownloadLink>
      <PDFViewer width="80%">
        <MyPDF />
      </PDFViewer>
    </>
  );
};
export default BarCodePdf