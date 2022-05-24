import { useRouter } from 'next/router'
import usePageTitle from '~/hooks/usePageTitle'
import { apiClient } from '~/utils/apiClient'
import { HStack, Box, VStack, InputGroup, InputLeftAddon, Input, Spacer, Button,Table, Thead, Tbody, Tr, Th, Td, useDisclosure, chakra } from "@chakra-ui/react"
import { useAspidaQuery } from '@aspida/react-query'
import dayjs from 'dayjs'
import RightDrawer from '~/components/drawer/rightDrawer'
import Breadcrumbs from '~/components/navigation/breadcrumb'
import {RiDeleteBinLine} from 'react-icons/ri'
import { useState, useCallback, createRef } from 'react'
import EditHistoryModal from './editHistory'
import useHistory from '~/hooks/useHistory'
import useUser from '~/hooks/useUser'
import HistoryDetail from './historyDetail'

const DeleteIcon = chakra(RiDeleteBinLine);

const HistoryListPage = () => {
  const router = useRouter()
  const { lotId } = router.query
  const { setTitle } = usePageTitle()

  const { data: item, refetch } = useAspidaQuery(apiClient.historyList, {query: {
    lotNo: String(lotId)
  }})
  
  const { setHistoryData, deleteHistory, defaultData } = useHistory()
  const { user } = useUser()

  const [ hoverIndex, setHoverIndex ] = useState<number>(0)
  const [ editHistoryId, setEditHistoryId ] = useState<number|undefined>(undefined)

  const [ detailId, setDetailId ] = useState<number|undefined>(undefined)
  const {isOpen: isRightOpen, onOpen: onRightOpen, onClose: onRightClose} = useDisclosure()
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
  
  const ref = createRef<HTMLTableRowElement>()
  const scrollToBottomOfList = useCallback(() => {
    ref?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    })
  }, [ ref ])
    
  return (
    <>
    <Breadcrumbs links={[
      {name: `${woodSpecies?.name} ${itemType?.name}一覧`, path:`/item/${itemType?.id}/species/${woodSpecies?.id}`},
      {name: `${lotId} ${woodSpecies?.name} ${itemType?.name}`}
      ]}></Breadcrumbs>
    <VStack align="left" pl="10">
      <HStack>
        <Box>
          <InputGroup size="sm">
            <InputLeftAddon
            >グレード</InputLeftAddon>
            <Input readOnly
              value={grade?.name}
            />
          </InputGroup>
        </Box>
        <Box>
          <InputGroup size="sm">
            <InputLeftAddon>仕様</InputLeftAddon>
            <Input readOnly
              value={item?.spec ?? undefined}
            />
          </InputGroup>
        </Box>
        <Box>
          <InputGroup size="sm">
            <InputLeftAddon>仕入先</InputLeftAddon>
            <Input readOnly
              value={item?.supplierName ?? undefined}
            />
          </InputGroup>
        </Box>
        <Box>
          <InputGroup size="sm">
          <InputLeftAddon>製造元</InputLeftAddon>
          <Input readOnly
              value={item?.manufacturer ?? undefined}
            />
          </InputGroup>
        </Box>
        <Box>
          <InputGroup size="sm">
            <InputLeftAddon>倉庫</InputLeftAddon>
            <Input readOnly
              value={warehouses?.find(w => w.id === item?.warehouseId)?.name}
            />
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup size="sm">
            <InputLeftAddon>寸法</InputLeftAddon>
            <Input readOnly
              value={scale}
            />
          </InputGroup>
        </Box>
        <Box>
          <InputGroup size="sm">
            <InputLeftAddon>入数</InputLeftAddon>
            <Input readOnly w="6em"
              value={item?.packageCount ? Number(item.costPackageCount): undefined}
            />
          </InputGroup>
        </Box>
        <Box>
          <InputGroup size="sm">
            <InputLeftAddon>原価</InputLeftAddon>
            <Input readOnly w="10em" textAlign="right"
              value={`${Number(item?.cost).toLocaleString() ?? ""}`}
            />
            <InputLeftAddon>/ {units?.find(u => u.id === item?.costUnitId)?.name}</InputLeftAddon>

          </InputGroup>
        </Box>
        <Box>
          <InputGroup size="sm">
            <InputLeftAddon>実数</InputLeftAddon>
            <Input readOnly w="8em" textAlign="right"
              value={`${item?.count}`}
            />
            <InputLeftAddon>{units?.find(u => u.id === item?.unitId)?.name}</InputLeftAddon>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup size="sm">
            <InputLeftAddon>仮数</InputLeftAddon>
            <Input readOnly w="8em" textAlign="right"
              value={`${item?.tempCount}`}
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
        <Box>
          {(item?.history.length ?? 0 )> 10 &&
          <Button type='submit' bgColor="gray.200" ml="10px"
          onClick={ (e) => {
            e.preventDefault()
            scrollToBottomOfList()
            }
          }
          >▼ 下へ</Button>
          }
        </Box>
      </HStack>
    </VStack>
    <VStack>
      <Box overflowY="auto" maxHeight="65vh" w="100vw" bgColor="white" zIndex="10" mt="10px">
        <Table variant="striped" className='hover' borderBottom="1px">
          <Thead position="sticky" top="0">
          <Th textAlign="center">入出庫日</Th>
          <Th textAlign="center">ステータス</Th>
          <Th textAlign="center">理由</Th>
          <Th textAlign="center">備考</Th>
          <Th textAlign="center">入庫数</Th>
          <Th textAlign="center">出庫数</Th>
          <Th textAlign="center">予約日</Th>
          <Th textAlign="center"></Th>
          </Thead>
          <Tbody overflowY="scroll">
            {item?.history && 
              item?.history.map((data, i, array) => (
              <Tr key={data.id} 
                style={{"color":data.isTemp?(data.reasonId===4?"green":""):""}}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(-1)}
                ref={(array.length -1 === i)?ref:undefined}
              >
                <Td>
                  <Button size="sm" onClick={() => {
                      setDetailId(data.id)
                      onRightOpen()
                      }}>
                    {dayjs(data.date).format('YY/MM/DD')}
                  </Button>
                </Td>
                <Td textAlign="center">{data.isTemp?"(仮)":""}{data.status===1?"入庫":"出庫"}</Td>
                <Td textAlign="center">{reasons?.find(r => r.id === data.reasonId)?.name}</Td>
                <Td>
                <Input 
                  border="solid 1px #ddd"
                  bgColor="white"
                  onBlur={async (e) => {
                    await apiClient.history._id(data.id).patch({body:{id:data.id, data:{note: e.currentTarget.value, editUserId: user?.id}}})
                  }}
                  defaultValue={data.note??undefined}
                  />
                  </Td>
                <Td textAlign="center">{data.addCount.toString()!="0" && data.addCount}</Td>
                <Td textAlign="center">{data.reduceCount.toString()!="0" && data.reduceCount}</Td>
                <Td textAlign="center">{data.bookDate?dayjs(data.bookDate).format("YY/MM/DD"):""}</Td>
                <Td textAlign="center">
                  <Box display="flex" 
                    justifyContent="space-around"
                    visibility={data.isTemp && hoverIndex==i?"visible":"hidden"}  
                  >
                  <DeleteIcon title='削除' cursor="pointer"
                    fontSize="lg"
                    color="red"
                    onClick={ async ()=> {
                      const res = confirm(`この明細を削除しますか？\n入出庫日:${dayjs(data.date).format("YY/MM/DD")}`)
                      if(res){
                        await deleteHistory(data.id).then(()=>{
                          refetch()
                        })
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
      </Box>
      <Button type='submit' bgColor="green.200" mt="10px"
        onClick={ (e) => {
          e.preventDefault()
          if(!item?.id){
            alert("itemIdが存在しません")
            return
          }
          setEditMode("新規作成")
          setEditHistoryId(undefined)
          setHistoryData({...defaultData, itemId:item?.id, editUserId: user?.id})
          onModalOpen()
          }
        }
        >＋新規追加</Button>
      </VStack>
    <aside >
        <RightDrawer
        isOpen={isRightOpen} onClose={onRightClose}
        width="30vw"
        >{
          detailId &&
          <HistoryDetail id={detailId}/>
          }
        </RightDrawer>
      </aside>
    <EditHistoryModal 
      isOpen={isModalOpen}
      onClose={onModalClose}
      mode={mode}
      editHistoryId={editHistoryId}
      onDone={()=>{
        onModalClose()
        refetch()
    }}/>
    </>
  )
}

export default HistoryListPage