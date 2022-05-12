import { useRouter } from 'next/router'
import usePageTitle from '~/hooks/usePageTitle'
import { apiClient } from '~/utils/apiClient'
import { HStack, Box, VStack, InputGroup, InputLeftAddon, Input, Spacer, Button,Table, Thead, Tbody, Tr, Th, Td, useDisclosure, chakra } from "@chakra-ui/react"
import { useAspidaQuery } from '@aspida/react-query'
import dayjs from 'dayjs'
import Footer from '~/components/Footer'
import BottomDrawer from '~/components/drawer/bottomDrawer'
import RightDrawer from '~/components/drawer/rightDrawer'
import Breadcrumbs from '~/components/navigation/breadcrumb'
import {RiEdit2Line, RiDeleteBinLine} from 'react-icons/ri'
import { Decimal } from "decimal.js"
import { useState } from 'react'
import { StockReason } from '~/server/domain/init/master'
import EditHistoryModal from './editHistory'
import useHistory from '~/hooks/useHistory'

const EditIcon = chakra(RiEdit2Line);
const DeleteIcon = chakra(RiDeleteBinLine);

const HistoryListPage = () => {
  const router = useRouter()
  const { lotId } = router.query
  const { setTitle } = usePageTitle()

  const { data: item } = useAspidaQuery(apiClient.historyList, {query: {
    lotNo: String(lotId)
  }})
  
  const { setHistoryData, deleteHistory, defaultData } = useHistory()
  
  const [ hoverIndex, setHoverIndex ] = useState<number>(0)
  const [ editHistoryId, setEditHistoryId ] = useState<number|undefined>(undefined)

  const {isOpen: isRightOpen, onClose: onRightClose} = useDisclosure()
  const {isOpen: isBottomOpen, onClose: onBottomClose} = useDisclosure()
  const {isOpen: isModalOpen, onOpen : onModalOpen, onClose: onModalClose} = useDisclosure()

  const { data: units, } = useAspidaQuery(apiClient.master.unit)
  const { data: grade } = useAspidaQuery(apiClient.master.grade._id(Number(item?.gradeId)))
  const { data: warehouses } = useAspidaQuery(apiClient.master.warehouse)
  const { data: itemType } = useAspidaQuery(apiClient.master.itemType._id(Number(item?.itemTypeId)))
  const { data: reasons } = useAspidaQuery(apiClient.master.reason)
  const { data: woodSpecies } = useAspidaQuery(apiClient.master.species._id(Number(item?.woodSpeciesId)))
  const arraivalDate = item?.arrivalDate ? "入荷日:" + dayjs(item.arrivalDate).format("YY/MM/DD"):""
  setTitle(`${lotId} ${woodSpecies?.name} ${itemType?.name} 在庫一覧   ${arraivalDate}`)
  const scale = `${item?.length} * ${item?.thickness}* ${item?.width}`
  const [mode, setEditMode] = useState<"新規作成"|"編集">("新規作成")
  return (
    <>
      <Breadcrumbs links={[
        {name: `${woodSpecies?.name} ${itemType?.name}一覧`, path:`/item/${itemType?.id}/species/${woodSpecies?.id}`},
        {name: `${lotId} ${woodSpecies?.name} ${itemType?.name}`}
        ]}></Breadcrumbs>
    <VStack align="left" pl="10">
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon
            >グレード</InputLeftAddon>
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
            <Input 
              onBlur={async (e) => {
                if(item?.id && e.currentTarget.value.length > 0){
                  await apiClient.stock._itemId(item?.id).patch({body:{id:item.id, data:{note: e.currentTarget.value}}})
                }
              }}
              defaultValue={item?.note??undefined}
              />
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box width="75vw" >
          <InputGroup>
            <InputLeftAddon>不良品備考</InputLeftAddon>
            <Input 
              placeholder="割れなど傷品としての備考" 
              onBlur={async (e) => {
                if(item?.id && e.currentTarget.value.length > 0){
                  await apiClient.stock._itemId(item?.id).patch({body:{id:item.id, data:{defectiveNote: e.currentTarget.value}}})
                }
              }}
              defaultValue={item?.defectiveNote??undefined}
              />
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
      <Th></Th>
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
            <Td>
              <Box display="flex" justifyContent="space-around">
              <EditIcon title='編集' cursor="pointer"
                onClick={()=>{
                  const reason = StockReason.find(r => r.id===data.reasonId)?.name
                  setHistoryData({
                    itemId: data.itemId,
                    note:data.note??undefined,
                    date: data.date,
                    status: data.status,
                    reason: reason,
                    reduceCount: new Decimal(data.reduceCount.toString()),
                    addCount: new Decimal(data.addCount.toString()),
                    editUserId: data.editUserId,
                    bookUserId: data.bookUserId,
                    bookDate: data.bookDate,
                    isTemp: data.isTemp
                  })
                  setEditMode("編集")
                  setEditHistoryId(data.id)
                  onModalOpen()
                }}
              />
              <DeleteIcon title='削除' cursor="pointer"
                onClick={()=>{
                  const res =confirm(`この明細を削除しますか？\n入出庫日:${dayjs(data.date).format("YY/MM/DD")}`)
                  if(res){
                    deleteHistory(data.id)
                  }
                }}
              />
              </Box>
            </Td>
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
            if(!item?.id){
              alert("itemIdが存在しません")
              return
            }
            setEditMode("新規作成")
            setEditHistoryId(undefined)
            setHistoryData({...defaultData, itemId:item?.id})
            onModalOpen()
            }
          }
          >新規追加</Button>
        </Box>
      </HStack>
    </Footer>
    <EditHistoryModal isOpen={isModalOpen} onClose={onModalClose} mode={mode} editHistoryId={editHistoryId}/>
    </>
  )
}

export default HistoryListPage