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

const WoodSpeciesPage = () => {
  const router = useRouter()
  const { setTitle } = usePageTitle()
  const { itemTypeId, woodSpeciesId } = router.query
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
        <Tr>
          <Td>HM-1522</Td>
          <Td>Aグレード</Td>
          <Td>塗装</Td>
          <Td>北材商事</Td>
          <Td>10</Td>
          <Td>4200*500*25</Td>
          <Td>21/2/31</Td>
          <Td>本社</Td>
          <Td>250,000/㎥</Td>
          <Td>10㎥</Td>
          <Td><Button colorScheme='blue' onClick={() => { router.push(`/history/${lotNo}`)}}>詳細</Button></Td>
        </Tr>
      </Tbody>
    </Table>

    </>
  )
}

export default WoodSpeciesPage