import { useRouter } from 'next/router'
import { Table, Thead, Tbody, Tr, Th, Td,} from "@chakra-ui/react"
import usePageTitle from '~/hooks/usePageTitle'
import { apiClient } from '~/utils/apiClient'
import { HStack, Box, VStack, InputGroup, InputLeftAddon, Input, Spacer, Button, } from "@chakra-ui/react"
import { useAspidaQuery } from '@aspida/react-query'
import { InputLabel } from "@material-ui/core"
import useStock from '~/hooks/useStock'
import dayjs from 'dayjs'

const HistoryListPage = () => {
  const router = useRouter()
  const { lotId } = router.query
  const { setTitle } = usePageTitle()

  const { data: item } = useAspidaQuery(apiClient.historyList, {query: {
    lotNo: String(lotId)
  }})
  const { updateField } = useStock()

  const { data: units, } = useAspidaQuery(apiClient.master.unit)
  const { data: grades } = useAspidaQuery(apiClient.master.grade)
  const { data: warehouses } = useAspidaQuery(apiClient.master.warehouse)
  const { data: itemType } = useAspidaQuery(apiClient.master.itemType._id(Number(item?.itemTypeId)))
  const { data: woodSpecies } = useAspidaQuery(apiClient.master.species._id(Number(item?.woodSpeciesId)))
  setTitle(`${lotId} ${woodSpecies?.name} ${itemType?.name} 在庫一覧`)
  const scale = `${item?.length} * ${item?.thickness}* ${item?.width}`
  return (
    <>
      <VStack align="left" pl="10">
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon>グレード</InputLeftAddon>
            <Input readOnly
              value={item?.gradeId ?? undefined}
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
            <Input readOnly w="4em"
              value={item?.packageCount ? Number(item.costPackageCount): undefined}
            />
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
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
              value={item?.warehouseId ?? undefined}
            />
          </InputGroup>
        </Box>
        <Box>
        <InputGroup>
          <InputLeftAddon>入荷日</InputLeftAddon>
            <Input readOnly
              value={item?.arrivalDate ? dayjs(item.arrivalDate).format("YY/MM/DD"):undefined}
            />
        </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon>原価</InputLeftAddon>
            <Input readOnly
              value={item?.cost ? Number(item.cost): undefined}
            />
            <InputLabel style={{fontSize:"1.5em", marginTop:"10px"}}>/</InputLabel>
            <Input readOnly
              value={item?.costUnitId ?? undefined}
            />
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon>数量</InputLeftAddon>
            <Input readOnly
              value={item?.count ? Number(item.count): undefined}
            />
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
    <Table variant="striped" colorScheme="gray">
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