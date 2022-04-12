import { useRouter } from 'next/router'
import { Table, Thead, Tbody, Tr, Th, Td,} from "@chakra-ui/react"
import usePageTitle from '~/hooks/usePageTitle'
import { apiClient } from '~/utils/apiClient'
import { useEffect } from 'react'

const HistoryListPage = () => {
  const router = useRouter()
  const { lotId } = router.query
  const { setTitle } = usePageTitle()
  useEffect(() => {
    (async() => {
      const response = await apiClient.issue.get({query: { isStored: false}})
      const data = await response.body
    })()
  }, [])
  setTitle(`${lotId} レッドシダー フローリング 在庫一覧`)
  return (
    <>
    <Table variant="striped" colorScheme="gray" w="150vw">
      <Thead>
        <Th>ロット番号</Th>
        <Th>樹種</Th>
        <Th>材種</Th>
        <Th>グレード</Th>
        <Th>仕様</Th>
        <Th>仕入先</Th>
        <Th>寸法</Th>
        <Th>入数</Th>
        <Th>数量</Th>
        <Th>製造元</Th>
        <Th>入荷日</Th>
        <Th>倉庫</Th>
        <Th>入荷予定日</Th>
        <Th>備考</Th>
        <Th>不良品備考</Th>
        <Th>原価単位数量</Th>
        <Th>原価</Th>
      </Thead>
      <Tbody>
        <Tr>
        <Td>S-20210809-1</Td>
        <Td>タモ</Td>
        <Td>集成材</Td>
        <Td>A</Td>
        <Td>ピッチ30ミリ</Td>
        <Td>北材商事</Td>
        <Td>4200*30*500</Td>
        <Td></Td>
        <Td>30枚</Td>
        <Td></Td>
        <Td>44417</Td>
        <Td>本社</Td>
        <Td></Td>
        <Td></Td>
        <Td></Td>
        <Td>0.063</Td>
        <Td>200000㎥</Td>
        </Tr>

      </Tbody>
    </Table>
    </>
  )
}

export default HistoryListPage