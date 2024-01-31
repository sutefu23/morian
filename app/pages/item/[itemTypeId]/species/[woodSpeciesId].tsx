import { useRouter } from 'next/router'
import { Button, Heading, Table, Thead, Tbody, Tr, Th, Td, VStack, HStack, useDisclosure, chakra, Checkbox, Input, Box } from '@chakra-ui/react'
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
import { GradeSelect, WarehouseSelect } from '~/components/select'
import { 出庫理由 } from '~/server/domain/entity/stock'
const BarCodeIcon = chakra(FaBarcode)

type SearchOptions = {
  warehouse?: number
  thickness?: number
  length?: number
  width?: number
  grade?: number
  notZero?: boolean
  specFilter?: string
}

const WoodSpeciesPage = () => {
  const router = useRouter()
  const { setTitle } = usePageTitle()
  const { itemTypeId, woodSpeciesId } = router.query
  const { isOpen, onOpen, onClose } = useDisclosure()
  const searchDefault: SearchOptions = {
    warehouse: undefined,
    thickness: undefined,
    length: undefined,
    width: undefined,
    grade: undefined,
    notZero: true,
    specFilter: ''
  }
  const [searchOptions, setSearchOptions] = useState<SearchOptions>(searchDefault)

  const query = {
    query: {
      woodSpeciesId: Number(woodSpeciesId),
      itemTypeId: Number(itemTypeId),
      notZero: searchOptions.notZero,
      warehouseId: searchOptions.warehouse,
      thickness: searchOptions.thickness,
      specFilter: searchOptions.specFilter,
      length: searchOptions.length,
      width: searchOptions.width,
      grade: searchOptions.grade,
      includeBooking: true
    },
    enabled: !!woodSpeciesId && !!itemTypeId
  }

  const { data: stocks } = useAspidaQuery(apiClient.itemList, query)
  const { data: stockYoyaku } = useAspidaQuery(apiClient.itemList, { query: { ...query.query, historyReason: 出庫理由.見積 }, enabled: !!woodSpeciesId && !!itemTypeId })
  const { data: stockMitsumori } = useAspidaQuery(apiClient.itemList, { query: { ...query.query, historyReason: 出庫理由.受注予約 }, enabled: !!woodSpeciesId && !!itemTypeId })

  const [selectedItem, setSelectedItem] = useState(stocks ? stocks[0] : undefined)
  const { data: units } = useAspidaQuery(apiClient.master.unit)
  const { data: grades } = useAspidaQuery(apiClient.master.grade)
  const { data: warehouses } = useAspidaQuery(apiClient.master.warehouse)
  const { data: itemType } = useAspidaQuery(apiClient.master.itemType._id(Number(itemTypeId)), { enabled: !!itemTypeId })
  const { data: woodSpecies } = useAspidaQuery(apiClient.master.species._id(Number(woodSpeciesId)), { enabled: !!woodSpeciesId })

  useEffect(() => {
    setTitle(`${woodSpecies?.name} ${itemType?.name} 在庫一覧`)
  }, [woodSpecies?.name, itemType?.name, setTitle])

  const representitiveUnit = units?.find((u) => u.id === stocks?.[0]?.unitId)
  const sumOfCount = stocks?.reduce((prev, current) => {
    return prev + (Number(current.count) ?? 0)
  }, 0)
  const yoyakuCount = stockYoyaku?.reduce((prev, current) => {
    return prev + Number(current.history?.reduce((prev, current) => prev + Number(current.reduceCount), 0))
  }, 0)

  const mitsumoriCount = stockMitsumori?.reduce((prev, current) => {
    return prev + Number(current.history?.reduce((prev, current) => prev + Number(current.reduceCount), 0))
  }, 0)

  return (
    <>
      <Breadcrumbs links={[{ name: `${woodSpecies?.name} ${itemType?.name}一覧` }]}></Breadcrumbs>
      <br />
      <VStack maxWidth={{ base: '100%' }} padding={'1em'} border={'1px'} borderColor={'blackAlpha.100'} bgColor={'blackAlpha.100'}>
        <HStack flexWrap={'wrap'}>
          <Heading as="h4" size={'sm'} fontWeight={'normal'}>
            検索:
          </Heading>
          <Input
            backgroundColor={'white'}
            width={'100px'}
            placeholder="長さ"
            type="number"
            value={searchOptions.length ?? ''}
            onChange={(e) => {
              setSearchOptions({ ...searchOptions, length: e.target.value ? Number(e.target.value) : undefined })
            }}
          />
          <Input
            backgroundColor={'white'}
            width={'100px'}
            placeholder="厚み"
            type="number"
            value={searchOptions.thickness ?? ''}
            onChange={(e) => {
              setSearchOptions({ ...searchOptions, thickness: e.target.value ? Number(e.target.value) : undefined })
            }}
          />
          <Input
            backgroundColor={'white'}
            width={'100px'}
            placeholder="幅"
            type="number"
            value={searchOptions.width ?? ''}
            onChange={(e) => {
              setSearchOptions({ ...searchOptions, width: e.target.value ? Number(e.target.value) : undefined })
            }}
          />
          <GradeSelect
            value={searchOptions.grade}
            width="100px"
            placeholder="グレードで検索"
            bgcolor="white"
            onSelect={(e) => {
              setSearchOptions({ ...searchOptions, grade: e.target.value ? Number(e.target.value) : undefined })
            }}
          />
          <WarehouseSelect
            width="100px"
            placeholder="倉庫で検索"
            onSelect={(e) => {
              setSearchOptions({ ...searchOptions, warehouse: e.target.value ? Number(e.target.value) : undefined })
            }}
            value={searchOptions.warehouse ?? ''}
          ></WarehouseSelect>
          <Input
            backgroundColor={'white'}
            width={'200px'}
            placeholder="仕様検索（部分一致）"
            type="text"
            value={searchOptions.specFilter}
            onChange={(e) => {
              setSearchOptions({ ...searchOptions, specFilter: e.target.value })
            }}
          />
          <Checkbox id="notZero" size={'lg'} backgroundColor="white" fontWeight={'bold'} isChecked={searchOptions.notZero} onChange={(e) => setSearchOptions({ ...searchOptions, notZero: e.target.checked })} defaultChecked={false}></Checkbox>
          <label htmlFor="notZero" style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            0在庫非表示
          </label>
          <Button
            bgColor={'pink.100'}
            marginLeft={'10px'}
            onClick={() => {
              setSearchOptions(searchDefault)
            }}
          >
            検索をクリア
          </Button>
        </HStack>
      </VStack>
      <VStack maxWidth={{ base: '100%' }} padding={'1em'} border={'1px'} borderColor={'blackAlpha.100'} bgColor={'blackAlpha.100'}>
        <HStack>
          <Heading as="h3" size={'sm'} fontWeight={'bold'}>
            見積予約数:{mitsumoriCount}
            {representitiveUnit?.name}&emsp; 受注予約数:{yoyakuCount}
            {representitiveUnit?.name}&emsp; 在庫数:{sumOfCount?.toLocaleString()}
            {representitiveUnit?.name}
          </Heading>
        </HStack>
      </VStack>
      <Box overflowX="auto">
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
                  <Td>
                    {stock.lotNo}
                    {stock.onlyBooking ? '【予約専用】' : ''}
                  </Td>
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
                  <Td color={dayjs(stock.arrivalDate).isAfter(dayjs()) ? 'red.500' : ''}>{stock.arrivalDate ? dayjs(stock.arrivalDate).format('YY/MM/DD') : ''}</Td>
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
      </Box>
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
