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
  const lotNo = ''
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
          <Td>21/4/1</Td>
          <Td>バラ出荷</Td>
          <Td>見積番号ｘｘｘｘ</Td>
          <Td>1000</Td>
          <Td></Td>
          <Td>ケース</Td>
          <Td>田中</Td>
          <Td>21/2/31</Td>
          <Td>平川</Td>
          <Td>平川</Td>
          <Td><Button colorScheme='blue' onClick={() => { router.push(`/history/${lotNo}`)}}>詳細</Button></Td>
        </Tr>
      </Tbody>
    </Table>

    </>
  )
}

export default WoodSpeciesPage