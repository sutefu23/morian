import styles from '~/styles/Home.module.css'
import Sidebar from '~/components/navigation/sidebar'
import { Button, Box, Table, Thead, Tbody, Tr, Th, Td, Heading, chakra, useDisclosure, VStack } from '@chakra-ui/react'
import usePageTitle from '~/hooks/usePageTitle'
import { apiClient } from '~/utils/apiClient'
import { useAspidaQuery } from '@aspida/react-query'
import SingleBarCodePdf from '~/components/barcode/SingleBarcode'
import NextLink from 'next/link'
import dayjs from 'dayjs'
import { FaBarcode } from 'react-icons/fa'
import { PDFDownloadLink } from '@react-pdf/renderer'
import Dialog from '~/components/feedback/dialog'
import { useEffect, useState } from 'react'
const BarCodeIcon = chakra(FaBarcode)

const Home = () => {
  const { setTitle } = usePageTitle()
  const { isOpen, onOpen, onClose } = useDisclosure()
  useEffect(() => {
    setTitle('TOP (最近登録順)')
  }, [setTitle])
  const { data: items } = useAspidaQuery(apiClient.itemList, {
    query: {
      orderBy: 'desc',
      limit: 30
    }
  })
  const [selectedItem, setSelectedItem] = useState(items ? items[0] : undefined)

  return (
    <>
      <div className={styles.container}>
        <main className={styles.main}>
          {!items || items?.length == 0 ? (
            <Heading textAlign="center" mt="20px">
              現在入荷情報はありません
            </Heading>
          ) : (
            <Box overflowX="auto">
              <Table variant="striped" colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th>管理番号</Th>
                    <Th>樹種</Th>
                    <Th>分類</Th>
                    <Th>グレード</Th>
                    <Th>仕様</Th>
                    <Th>寸法</Th>
                    <Th>入数</Th>
                    <Th>数量</Th>
                    <Th>仕入先</Th>
                    <Th>倉庫</Th>
                    <Th>備考</Th>
                    <Th>入荷日</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {items &&
                    items.map((item, i) => (
                      <Tr key={i}>
                        <Td>{item.lotNo}</Td>
                        <Td>{item?.woodSpeciesName}</Td>
                        <Td>{item?.itemTypeName}</Td>
                        <Td>{item?.gradeName}</Td>
                        <Td>{item?.spec}</Td>
                        <Td>
                          {item?.length}
                          {item?.thickness ? `*${item?.thickness}` : ''}
                          {item?.width ? `*${item?.width}` : ''}
                        </Td>
                        <Td>
                          {item?.packageCount}
                          {item?.packageCountUnitName}
                        </Td>
                        <Td>
                          {item?.count}
                          {item.unitName}
                        </Td>
                        <Td>{item.supplierName}</Td>
                        <Td>{item.warehouseName}</Td>
                        <Td>{item.note}</Td>
                        <Td color={dayjs(item.arrivalDate).isAfter(dayjs()) ? 'red.500' : ''}>{dayjs(item.arrivalDate).format('YY/MM/DD')}</Td>
                        <Td textAlign="right">
                          <Button
                            onClick={() => {
                              setSelectedItem(item)
                              onOpen()
                            }}
                          >
                            <BarCodeIcon></BarCodeIcon>
                          </Button>
                          <NextLink href={`/history/${item.lotNo}`}>
                            <Button ml="5" bgColor="blue.100">
                              詳細
                            </Button>
                          </NextLink>
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </Box>
          )}
          <Dialog
            isOpen={isOpen}
            title="バーコード印刷"
            onClose={onClose}
            size={'xl'}
            button1={{
              text: '閉じる',
              event: onClose,
              color: 'blue'
            }}
          >
            <VStack>
              {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
              {/* @ts-ignore */}
              <PDFDownloadLink document={<SingleBarCodePdf item={selectedItem} />} fileName={`${selectedItem?.lotNo}.pdf`}>
                {({ loading }: { loading: boolean }) => (loading ? 'Loading' : <Button color="blue.300">クリックでPDFダウンロード</Button>)}
              </PDFDownloadLink>
            </VStack>
          </Dialog>
        </main>
      </div>
    </>
  )
}

export default Home
