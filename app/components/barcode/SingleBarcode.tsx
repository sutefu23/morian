// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Page, Font, Text, View, Image, Document, StyleSheet } from '@react-pdf/renderer'
import JsBarcode from 'jsbarcode'
import { Item } from '$/node_modules/@prisma/client'
import * as React from 'react'

export const SingleBarCodePdf = ({ item }: { item: Item }) => {
  if (!item) return <div>loading...</div>
  // ttfファイルのフォント定義
  Font.register({
    family: 'Nasu-Regular',
    src: '/fonts/Nasu-Regular.ttf'
  })

  const canvas = document.createElement('canvas')
  JsBarcode(canvas, item.lotNo, { format: 'code39' })
  const barcode = canvas.toDataURL()

  const size = (item.length ?? '') + (item.thickness ? `*${item.thickness}` : '') + (item.width ? `*${item.width}` : '')

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
    lotNo: {
      fontSize: '14pt',
      fontFamily: 'Nasu-Regular',
      textAlign: 'center',
      marginBottom: '10px'
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
      justifyContent: 'space-between'
    },
    barcode: { width: '30%', height: 'auto', textAlign: 'center', marginBottom: '20px', marginLeft: '10px' }
  })

  return (
    <Document>
      <Page size="A4" style={styles.body} wrap={true}>
        <View style={styles.display}>
          <View style={{ textAlign: 'center' }}>
            <Text style={styles.lotNo}>{item.lotNo}</Text>
            <Text style={styles.subtitle}>
              {item.woodSpeciesName} {item.itemTypeName} {item.spec}
            </Text>
            <Text style={styles.title}>{size}</Text>
            <Text style={styles.title}>{item.note}</Text>
            <Text style={styles.title}>{item.defectiveNote}</Text>
          </View>
          <View style={styles.barcode}>
            <Image src={barcode} style={{ height: 50 }} />
            <Text style={styles.text}>
              {item.woodSpeciesName} {item.itemTypeName}
            </Text>
            <Text style={styles.text}>{size}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
}

export default SingleBarCodePdf
