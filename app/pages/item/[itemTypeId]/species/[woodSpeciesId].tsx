import { useRouter } from 'next/router'
import { Button, Table, Thead, Tbody, Tr, Th, Td, VStack, useDisclosure, chakra } from '@chakra-ui/react'
import usePageTitle from '~/hooks/usePageTitle'
import { apiClient } from '~/utils/apiClient'
import dayjs from 'dayjs'
import NextLink from 'next/link'
import { useAspidaQuery } from '@aspida/react-query'
import Breadcrumbs from '~/components/navigation/breadcrumb'
import { useState } from 'react'
import { FaBarcode } from 'react-icons/fa'
import { PDFDownloadLink } from '@react-pdf/renderer'
import Dialog from '~/components/feedback/dialog'
import SingleBarCodePdf from '~/components/barcode/SingleBarcode'
import { useEffect } from 'react'
const BarCodeIcon = chakra(FaBarcode)

const WoodSpeciesPage = () => {
  const router = useRouter()
  const { setTitle } = usePageTitle()
  const { itemTypeId, woodSpeciesId } = router.query
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: stocks } = useAspidaQuery(apiClient.itemList, {
    query: {
      woodSpeciesId: Number(woodSpeciesId),
      itemTypeId: Number(itemTypeId)
    }
  })
  const [selectedItem, setSelectedItem] = useState(stocks ? stocks[0] : undefined)

  const { data: units } = useAspidaQuery(apiClient.master.unit)
  const { data: grades } = useAspidaQuery(apiClient.master.grade)
  const { data: warehouses } = useAspidaQuery(apiClient.master.warehouse)
  const { data: itemType } = useAspidaQuery(apiClient.master.itemType._id(Number(itemTypeId)))
  const { data: woodSpecies } = useAspidaQuery(apiClient.master.species._id(Number(woodSpeciesId)))

  useEffect(() => {
    setTitle(`${woodSpecies?.name} ${itemType?.name} 在庫一覧`)
  }, [woodSpecies?.name, itemType?.name, setTitle])
  if (!woodSpeciesId || !itemTypeId) {
    return (
      <>
        <p>Loading...</p>
      </>
    )
  }
  return (
    <>
      <Breadcrumbs links={[{ name: `${woodSpecies?.name} ${itemType?.name}一覧` }]}></Breadcrumbs>
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>ロットNo</Th>
            <Th>グレード</Th>
            <Th>仕様</Th>
            <Th>仕入先</Th>
            <Th>入数</Th>
            <Th>寸法</Th>
            <Th>入荷日</Th>
            <Th>倉庫</Th>
            <Th>備考</Th>
            <Th>原価</Th>
            <Th>仮在庫数</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {stocks &&
            stocks.map((stock) => (
              <Tr key={stock.id}>
                <Td>{stock.lotNo}</Td>
                <Td>{grades?.find((g) => g.id === stock.gradeId)?.name}</Td>
                <Td>{stock.spec}</Td>
                <Td>{stock.supplierName}</Td>
                <Td>
                  {stock.packageCount}
                  {stock.packageCountUnitName}
                </Td>
                <Td>
                  {stock.length}
                  {stock.thickness ? `*${stock.thickness}` : ''}
                  {stock.width ? `*${stock.width}` : ''}
                </Td>
                <Td>{stock.arrivalDate ? dayjs(stock.arrivalDate).format('YY/MM/DD') : ''}</Td>
                <Td>{warehouses?.find((w) => w.id === stock.warehouseId)?.name}</Td>
                <Td>{stock.note}</Td>
                <Td>
                  {stock.cost}/{units?.find((u) => u.id === stock.costUnitId)?.name}
                </Td>
                <Td color={Number(stock.tempCount) < 0 ? 'red' : ''}>
                  {stock.tempCount} {units?.find((u) => u.id === stock.unitId)?.name}
                </Td>
                <Td>
                  <Button
                    onClick={() => {
                      setSelectedItem(stock)
                      onOpen()
                    }}
                  >
                    <BarCodeIcon></BarCodeIcon>
                  </Button>
                  <NextLink href={`/history/${stock.lotNo}`}>
                    <Button textAlign="center" cursor="pointer" colorScheme="blue" as="a">
                      詳細
                    </Button>
                  </NextLink>
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
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
            {({ loading }) => (loading ? 'Loading' : <Button color="blue.300">クリックでPDFダウンロード</Button>)}
          </PDFDownloadLink>
        </VStack>
      </Dialog>
    </>
  )
}

export default WoodSpeciesPage
