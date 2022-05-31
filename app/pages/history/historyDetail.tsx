import { useAspidaQuery } from "@aspida/react-query"
import {
  Table,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react"
import dayjs from 'dayjs'
type Props = {
  id: number
}
import { apiClient } from '~/utils/apiClient'
const HistoryDetail = ({id}:Props) => {
  const {data: history} = useAspidaQuery(apiClient.history._id(id))
  const {data: bookUser} = useAspidaQuery(apiClient.user._id(history?.bookUserId ?? -1))
  const {data: editUser} = useAspidaQuery(apiClient.user._id(history?.editUserId ?? -1))
  return (
    <Table variant="striped" colorScheme="gray">
    <Tr><Th>予約期限</Th><Td>{history?.bookDate?dayjs(history?.bookDate).format("YYYY-MM-DD"):""}</Td></Tr>
    <Tr><Th>予約者</Th><Td>{bookUser?.name}</Td></Tr>
    <Tr><Th>更新者</Th><Td>{editUser?.name} </Td></Tr>
    <Tr><Th>更新日</Th><Td>{history?.updatedAt?dayjs(history?.updatedAt).format("YYYY-MM-DD HH:mm:ss"):""}</Td></Tr>
    <Tr><Th>作成日</Th><Td>{history?.createdAt?dayjs(history?.createdAt).format("YYYY-MM-DD HH:mm:ss"):""}</Td></Tr>
    </Table>
  )
}
export default HistoryDetail