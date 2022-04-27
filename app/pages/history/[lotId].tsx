import { useRouter } from 'next/router'
import { Table, Thead, Tbody, Tr, Th, Td, useDisclosure,} from "@chakra-ui/react"
import usePageTitle from '~/hooks/usePageTitle'
import { apiClient } from '~/utils/apiClient'
import { HStack, Box, VStack, InputGroup, InputLeftAddon, Input, Spacer, Button, } from "@chakra-ui/react"
import { useAspidaQuery } from '@aspida/react-query'
import { InputLabel } from "@material-ui/core"
import useStock from '~/hooks/useStock'
import dayjs from 'dayjs'
import Footer from '~/components/Footer'
import BottomDrawer from '~/components/drawer/bottomDrawer'
import RightDrawer from '~/components/drawer/rightDrawer'

const HistoryListPage = () => {
  const router = useRouter()
  const { lotId } = router.query
  const { setTitle } = usePageTitle()

  const { data: item } = useAspidaQuery(apiClient.historyList, {query: {
    lotNo: String(lotId)
  }})
  const { updateField } = useStock()

  const {isOpen: isRightOpen, onOpen: onRightOpen, onClose: onRightClose} = useDisclosure()
  const {isOpen: isBottomOpen, onOpen: onBottomOpen, onClose: onBottomClose} = useDisclosure()


  const { data: units, } = useAspidaQuery(apiClient.master.unit)
  const { data: grade } = useAspidaQuery(apiClient.master.grade._id(Number(item?.gradeId)))
  const { data: warehouses } = useAspidaQuery(apiClient.master.warehouse)
  const { data: itemType } = useAspidaQuery(apiClient.master.itemType._id(Number(item?.itemTypeId)))
  const { data: reasons } = useAspidaQuery(apiClient.master.reason)
  const { data: woodSpecies } = useAspidaQuery(apiClient.master.species._id(Number(item?.woodSpeciesId)))
  const arraivalDate = item?.arrivalDate ? "入荷日:" + dayjs(item.arrivalDate).format("YY/MM/DD"):""
  setTitle(`${lotId} ${woodSpecies?.name} ${itemType?.name} 在庫一覧   ${arraivalDate}`)
  const scale = `${item?.length} * ${item?.thickness}* ${item?.width}`
  return (
    <>
      <VStack align="left" pl="10">
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon>グレード</InputLeftAddon>
            <Input readOnly
              value={grade?.name}
            />
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon>仕様</InputLeftAddon>
            <Input readOnly
              value={item?.spec ?? undefined}
            />
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon>仕入先</InputLeftAddon>
            <Input readOnly
              value={item?.supplierName ?? undefined}
            />
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
          <InputLeftAddon>製造元</InputLeftAddon>
          <Input readOnly
              value={item?.manufacturer ?? undefined}
            />
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon>倉庫</InputLeftAddon>
            <Input readOnly
              value={warehouses?.find(w => w.id === item?.warehouseId)?.name}
            />
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon>寸法</InputLeftAddon>
            <Input readOnly
              value={scale}
            />
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon>入数</InputLeftAddon>
            <Input readOnly w="6em"
              value={item?.packageCount ? Number(item.costPackageCount): undefined}
            />
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon>原価</InputLeftAddon>
            <Input readOnly w="10em" textAlign="right"
              value={`${Number(item?.cost).toLocaleString() ?? ""}`}
            />
            <InputLeftAddon>/ {units?.find(u => u.id === item?.costUnitId)?.name}</InputLeftAddon>

          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon>数量</InputLeftAddon>
            <Input readOnly w="8em" textAlign="right"
              value={`${item?.count}`}
            />
            <InputLeftAddon>{units?.find(u => u.id === item?.unitId)?.name}</InputLeftAddon>
          </InputGroup>
        </Box>
      </HStack>
        <Spacer/>
      <HStack>
        <Box width="75vw" >
          <InputGroup>
            <InputLeftAddon>備考</InputLeftAddon>
            <Input onChange={(e) => { updateField<"note">("note", e.target.value)}}/>
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box width="75vw" >
          <InputGroup>
            <InputLeftAddon>不良品備考</InputLeftAddon>
            <Input placeholder="割れなど傷品としての備考" onChange={(e) => { updateField<"defectiveNote">("defectiveNote", e.target.value)}}/>
          </InputGroup>
        </Box>
      </HStack>
    </VStack>
    <Table variant="striped" textAlign="center">
      <Thead>
      <Th>入出庫日</Th>
      <Th>ステータス</Th>
      <Th>理由</Th>
      <Th>備考</Th>
      <Th>出庫数</Th>
      <Th>入庫数</Th>
      <Th>予約日</Th>
      <Th>仮</Th>
      </Thead>
      <Tbody>
        {item?.history && 
          item?.history.map(data => (
          <Tr key={data.id} >
            <Td>{dayjs(data.date).format('YY/MM/DD')}</Td>
            <Td>{data.status===1?"入庫":"出庫"}</Td>
            <Td>{reasons?.find(r => r.id === data.reasonId)?.name}</Td>
            <Td>{data.note}</Td>
            <Td>{data.reduceCount}</Td>
            <Td>{data.addCount}</Td>
            <Td>{dayjs(data.bookDate).format("YY/MM/DD")}</Td>
            <Td>{data.isTemp}</Td>    
          </Tr>
          ))
        }
      </Tbody>
    </Table>
    <aside >
        <RightDrawer
        isOpen={isRightOpen} onClose={onRightClose}
        width="30vw"
        >
        </RightDrawer>
      </aside>
    <Footer>
        <BottomDrawer title="入庫登録" isOpen={isBottomOpen} onClose={onBottomClose} height="40vw">

        </BottomDrawer>
        <HStack textAlign="right">
        <Box>
          <Button type='submit' ml={50} w={100} bgColor="green.200"
          onClick={ (e) => {
            e.preventDefault()
            }
          }
          >新規追加</Button>
        </Box>
        <Box>
          <Button ml={50} w={100} bgColor="red.200"
            onClick={() => undefined}
          >編集</Button>
        </Box>
      </HStack>
    </Footer>
    </>
  )
}

export default HistoryListPage