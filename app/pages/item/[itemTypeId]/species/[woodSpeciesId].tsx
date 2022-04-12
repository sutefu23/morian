import { useRouter } from 'next/router'
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react"
import usePageTitle from '~/hooks/usePageTitle'
import { useEffect, useState } from 'react'
import { apiClient } from '~/utils/apiClient'
import { ItemDTO } from '~/server/domain/dto/item'
import dayjs from 'dayjs'
import { SupplierDTO } from '~/server/domain/dto/supplier'

const WoodSpeciesPage = () => {
  const router = useRouter()
  const { setTitle } = usePageTitle()
  const { itemTypeId, woodSpeciesId } = router.query
  const [ stocks, setStocks ] = useState<ItemDTO[]>([])
  useEffect(() => {
    if(!woodSpeciesId || !itemTypeId){
      return 
    }
    (async() => {
      const response = await apiClient.stock.get({query:
        [
          {field:"woodSpeciesId", operator:"=", value: woodSpeciesId as string },
          {field:"itemTypeId", operator:"=", value: itemTypeId as string }
        ]})
      const data = await response.body
      setStocks(data)
    })()
  }, [])
  
  const lotNo = '155-1'
  setTitle("レッドシダー　フローリング 一覧")
  return (
    <>
    <Table variant="striped" colorScheme="gray" >
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
          <Th>原価</Th>
          <Th>仮在庫数</Th>
          <Th></Th>
        </Tr>
      </Thead>
      <Tbody>
        {stocks.map((stock) => (
          <Tr key={stock.id}>
          <Td>{stock.lotNo}</Td>
          <Td>{stock.gradeName}</Td>
          <Td>{stock.spec}</Td>
          <Td>{stock.supplierId}</Td>
          <Td>{stock.packageCount}</Td>
          <Td>{stock.length}{(stock.thickness)?`*${stock.thickness}`:""}{(stock.width)?`*${stock.width}`:""}</Td>
          <Td>{dayjs(stock.arrivalDate).format('YY/MM/DD')}</Td>
          <Td>{stock.warehouseName}</Td>
          <Td>{stock.cost}/{stock.costUnitName}</Td>
          <Td>{stock.tempCount} {stock.unitName}</Td>
          <Td><Button colorScheme='blue' onClick={() => { router.push(`/history/${lotNo}`)}}>詳細</Button></Td>
        </Tr>
        ))}
      </Tbody>
    </Table>

    </>
  )
}

export default WoodSpeciesPage