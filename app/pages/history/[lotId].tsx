import { useRouter } from 'next/router'
import usePageTitle from '~/hooks/usePageTitle'
import { apiClient } from '~/utils/apiClient'
import {
  HStack,
  Box,
  VStack,
  InputGroup,
  InputLeftAddon,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useDisclosure,
  chakra,
  Text,
  FormLabel
} from '@chakra-ui/react'
import { useAspidaQuery } from '@aspida/react-query'
import dayjs from 'dayjs'
import RightDrawer from '~/components/drawer/rightDrawer'
import Breadcrumbs from '~/components/navigation/breadcrumb'
import { RiDeleteBinLine } from 'react-icons/ri'
import { useState, useCallback, createRef } from 'react'
import EditHistoryModal from '../../components/form/editHistory'
import useHistory from '~/hooks/useHistory'
import HistoryDetail from './historyDetail'
import useUser from '~/hooks/useUser'
import useRegisteredItem from '~/hooks/useRegisteredItem'
import { PartialUpdateItemData } from '~/server/domain/service/stock'
import GradeSelect from '~/components/select/gradeSelect'
import WarehouseSelect from '~/components/select/warehouseSelect'
import UnitSelect from '~/components/select/unitSelect'
import { Decimal } from 'server/node_modules/decimal.js'
const DeleteIcon = chakra(RiDeleteBinLine)

const HistoryListPage = () => {
  const router = useRouter()
  const { lotId } = router.query
  const { setTitle } = usePageTitle()

  const { data: item, refetch } = useAspidaQuery(apiClient.historyList, {
    query: {
      lotNo: String(lotId)
    }
  })

  const { deleteHistory } = useHistory()
  const { user } = useUser()
  const [hoverIndex, setHoverIndex] = useState<number>(0)
  const [, setEditHistoryId] = useState<number | undefined>(undefined)

  const [detailId, setDetailId] = useState<number | undefined>(undefined)

  const { editRegisteredItem, deleteRegisterdItem } = useRegisteredItem()
  const isItemEditable = useCallback(() => {
    return (item?.history?.length ?? 0) <= 1
  }, [item?.history])

  const {
    isOpen: isRightOpen,
    onOpen: onRightOpen,
    onClose: onRightClose
  } = useDisclosure()
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose
  } = useDisclosure()

  const { data: reasons } = useAspidaQuery(apiClient.master.reason)
  const arraivalDate = item?.arrivalDate
    ? '入荷日:' + dayjs(item.arrivalDate).format('YY/MM/DD')
    : ''
  setTitle(
    `${lotId} ${item?.woodSpeciesName} ${item?.itemTypeName} 在庫一覧   ${arraivalDate}`
  )
  const [mode, setEditMode] = useState<'新規作成' | '編集'>('新規作成')

  const ref = createRef<HTMLTableRowElement>()

  const editItem = useCallback(
    async (editData: PartialUpdateItemData) => {
      if (item?.id) {
        await editRegisteredItem(item.id, editData)
        refetch()
      }
    },
    [editRegisteredItem, item?.id, refetch]
  )

  const deleteItem = useCallback(async () => {
    if (item?.id) {
      try {
        await deleteRegisterdItem(item.id)
        alert('削除しました')
        router.push(`/item/${item?.itemTypeId}/species/${item?.woodSpeciesId}`)
      } catch (e) {
        alert('削除に失敗しました')
        console.error((e as Error).message)
      }
    }
  }, [
    deleteRegisterdItem,
    item?.id,
    item?.itemTypeId,
    item?.woodSpeciesId,
    router
  ])

  const scrollToBottomOfList = useCallback(() => {
    ref?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    })
  }, [ref])

  return (
    <>
      <Breadcrumbs
        links={[
          {
            name: `${item?.woodSpeciesName} ${item?.itemTypeName}一覧`,
            path: `/item/${item?.itemTypeId}/species/${item?.woodSpeciesId}`
          },
          { name: `${lotId} ${item?.woodSpeciesName} ${item?.itemTypeName}` }
        ]}
      ></Breadcrumbs>
      <VStack align="left">
        {isItemEditable() ? (
          <HStack>
            <Text color="red.500">
              ※商品情報は明細を追加する前まで変更／削除可能です。
            </Text>
          </HStack>
        ) : (
          <></>
        )}
        <HStack>
          <Box>
            <InputGroup size="sm">
              <InputLeftAddon>グレード</InputLeftAddon>
              {isItemEditable() ? (
                <GradeSelect
                  size="sm"
                  value={item?.gradeId ?? undefined}
                  onSelect={(e) => {
                    const { options, selectedIndex } = e.target
                    editItem({
                      gradeId: Number(e.target.value),
                      gradeName: options[selectedIndex].innerHTML
                    })
                  }}
                />
              ) : (
                <Input readOnly value={item?.gradeName ?? undefined} />
              )}
            </InputGroup>
          </Box>
          <Box>
            <InputGroup size="sm">
              <InputLeftAddon>仕様</InputLeftAddon>
              {isItemEditable() ? (
                <Input
                  placeholder="自由入力"
                  defaultValue={item?.spec ?? undefined}
                  onBlur={(e) => {
                    editItem({
                      spec: e.target.value
                    })
                  }}
                />
              ) : (
                <Input readOnly value={item?.spec ?? undefined} />
              )}
            </InputGroup>
          </Box>
          <Box>
            <InputGroup size="sm">
              <InputLeftAddon>仕入先</InputLeftAddon>
              <Input readOnly value={item?.supplierName ?? undefined} />
            </InputGroup>
          </Box>
          <Box>
            <InputGroup size="sm">
              <InputLeftAddon>製造元</InputLeftAddon>
              {isItemEditable() ? (
                <Input
                  placeholder="自由入力"
                  defaultValue={item?.manufacturer ?? undefined}
                  onBlur={(e) => {
                    editItem({
                      manufacturer: e.target.value
                    })
                  }}
                />
              ) : (
                <Input readOnly value={item?.manufacturer ?? undefined} />
              )}
            </InputGroup>
          </Box>
          <Box>
            <InputGroup size="sm">
              <InputLeftAddon>倉庫</InputLeftAddon>
              {isItemEditable() ? (
                <WarehouseSelect
                  required
                  size="sm"
                  value={item?.warehouseId}
                  onSelect={(e) => {
                    const { options, selectedIndex } = e.target
                    editItem({
                      warehouseId: Number(e.target.value),
                      warehouseName: options[selectedIndex].innerHTML
                    })
                  }}
                />
              ) : (
                <Input readOnly value={item?.warehouseName} />
              )}
            </InputGroup>
          </Box>
        </HStack>
        <HStack>
          <Box>
            <InputGroup size="sm">
              <InputLeftAddon>寸法</InputLeftAddon>
              {isItemEditable() ? (
                <>
                  <Input
                    placeholder="長さ"
                    size="sm"
                    defaultValue={item?.length ?? undefined}
                    type="text"
                    onBlur={(e) => {
                      editItem({
                        length: e.target.value
                      })
                    }}
                  />
                  <FormLabel style={{ fontSize: '1.2em', marginTop: '5px' }}>
                    ｘ
                  </FormLabel>
                  <Input
                    size="sm"
                    placeholder="厚み"
                    type="number"
                    defaultValue={item?.thickness ?? undefined}
                    onBlur={(e) => {
                      editItem({
                        thickness: Number(e.target.value)
                      })
                    }}
                  />
                  <FormLabel style={{ fontSize: '1.2em', marginTop: '5px' }}>
                    ｘ
                  </FormLabel>
                  <Input
                    size="sm"
                    placeholder="幅"
                    type="number"
                    defaultValue={item?.width ?? undefined}
                    onBlur={(e) => {
                      editItem({
                        width: Number(e.target.value)
                      })
                    }}
                  />
                </>
              ) : (
                <Input
                  readOnly
                  value={`${item?.length ?? ''}${
                    item?.thickness ? '*' + item.thickness : ''
                  }${item?.width ? '*' + item.width : ''}`}
                />
              )}
            </InputGroup>
          </Box>
          <Box>
            <InputGroup size="sm">
              <InputLeftAddon>入数</InputLeftAddon>
              {isItemEditable() ? (
                <>
                  <Input
                    required
                    size="sm"
                    type="number"
                    defaultValue={
                      item?.packageCount ? Number(item.packageCount) : undefined
                    }
                    placeholder="数字"
                    onBlur={(e) => {
                      editItem({
                        packageCount: e.target.value
                          ? (new Decimal(e.target.value) as unknown as Decimal)
                          : undefined
                      })
                    }}
                  />
                  <UnitSelect
                    required
                    value={item?.packageCountUnitId ?? undefined}
                    size="sm"
                    onSelect={(e) => {
                      const { options, selectedIndex } = e.target
                      editItem({
                        packageCountUnitId: Number(e.target.value),
                        packageCountUnitName: options[selectedIndex].innerHTML
                      })
                    }}
                  />
                </>
              ) : (
                <>
                  <Input
                    readOnly
                    w="6em"
                    size="sm"
                    value={
                      item?.packageCount ? Number(item.packageCount) : undefined
                    }
                  />
                  {item?.packageCountUnitName ? (
                    <InputLeftAddon>
                      {item?.packageCountUnitName}
                    </InputLeftAddon>
                  ) : (
                    <></>
                  )}
                </>
              )}
            </InputGroup>
          </Box>
          <Box>
            <InputGroup size="sm">
              <InputLeftAddon>原価</InputLeftAddon>
              {isItemEditable() ? (
                <Input
                  required
                  type="number"
                  defaultValue={item?.cost ? Number(item.cost) : undefined}
                  placeholder="数字"
                  onBlur={(e) => {
                    editItem({
                      cost: e.target.value
                        ? (new Decimal(e.target.value) as unknown as Decimal)
                        : undefined
                    })
                  }}
                />
              ) : (
                <Input
                  readOnly
                  w="10em"
                  textAlign="right"
                  value={`${Number(item?.cost).toLocaleString() ?? ''}`}
                />
              )}
              <InputLeftAddon>/ {item?.costUnitName}</InputLeftAddon>
            </InputGroup>
          </Box>
          <Box>
            <InputGroup size="sm">
              <InputLeftAddon>実数</InputLeftAddon>
              <Input
                readOnly
                w="8em"
                textAlign="right"
                value={`${item?.count}`}
              />
              <InputLeftAddon>{item?.unitName}</InputLeftAddon>
            </InputGroup>
          </Box>
          <Box>
            <InputGroup size="sm">
              <InputLeftAddon>仮数</InputLeftAddon>
              <Input
                readOnly
                w="8em"
                textAlign="right"
                value={`${item?.tempCount}`}
              />
              <InputLeftAddon>{item?.unitName}</InputLeftAddon>
            </InputGroup>
          </Box>
        </HStack>
        <HStack>
          <Box width="75vw">
            <InputGroup>
              <InputLeftAddon>備考</InputLeftAddon>
              <Input
                onBlur={async (e) => {
                  if (item?.id && e.currentTarget.value.length > 0) {
                    await editItem({ note: e.currentTarget.value })
                  }
                }}
                defaultValue={item?.note ?? undefined}
              />
            </InputGroup>
          </Box>
        </HStack>
        <HStack>
          <Box width="75vw">
            <InputGroup>
              <InputLeftAddon>不良品備考</InputLeftAddon>
              <Input
                placeholder="割れなど傷品としての備考"
                onBlur={async (e) => {
                  if (item?.id && e.currentTarget.value.length > 0) {
                    await editItem({ defectiveNote: e.currentTarget.value })
                  }
                }}
                defaultValue={item?.defectiveNote ?? undefined}
              />
            </InputGroup>
          </Box>
          <Box>
            {isItemEditable() && (
              <>
                <Button
                  type="submit"
                  bgColor="red.200"
                  ml="10px"
                  onClick={async (e) => {
                    e.preventDefault()
                    if (confirm('全体を削除しますか？')) {
                      await deleteItem()
                    }
                  }}
                >
                  全体削除
                </Button>
              </>
            )}
            {(item?.history?.length ?? 0) > 10 && (
              <Button
                type="submit"
                bgColor="gray.200"
                ml="10px"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToBottomOfList()
                }}
              >
                ▼ 下へ
              </Button>
            )}
          </Box>
        </HStack>
      </VStack>
      <VStack>
        <Box
          overflowY="auto"
          maxHeight="65vh"
          w="100vw"
          bgColor="white"
          zIndex="10"
          mt="10px"
        >
          <Table variant="striped" className="hover" borderBottom="1px">
            <Thead position="sticky" top="0" bgColor="white" zIndex="10">
              <Tr>
                <Th textAlign="center">入出庫日</Th>
                <Th textAlign="center">ステータス</Th>
                <Th textAlign="center">理由</Th>
                <Th textAlign="center">備考</Th>
                <Th textAlign="center">入庫数</Th>
                <Th textAlign="center">出庫数</Th>
                <Th textAlign="center">予約期限</Th>
                <Th textAlign="center"></Th>
              </Tr>
            </Thead>
            <Tbody overflowY="scroll">
              {item?.history &&
                item?.history.map((data, i, array) => (
                  <Tr
                    key={data.id}
                    style={{
                      color: data.isTemp
                        ? data.reasonId === 4
                          ? 'green'
                          : 'red'
                        : ''
                    }}
                    onMouseEnter={() => setHoverIndex(i)}
                    onMouseLeave={() => setHoverIndex(-1)}
                    ref={array.length - 1 === i ? ref : undefined}
                  >
                    <Td>
                      <Button
                        size="sm"
                        onClick={() => {
                          setDetailId(data.id)
                          onRightOpen()
                        }}
                      >
                        {dayjs(data.date).format('YY/MM/DD')}
                      </Button>
                    </Td>
                    <Td textAlign="center">
                      {data.isTemp ? '(仮)' : ''}
                      {data.status === 1 ? '入庫' : '出庫'}
                    </Td>
                    <Td textAlign="center">
                      {reasons?.find((r) => r.id === data.reasonId)?.name}
                    </Td>
                    <Td>
                      <Input
                        border="solid 1px #ddd"
                        bgColor="white"
                        onBlur={async (e) => {
                          await apiClient.history._id(data.id).patch({
                            body: {
                              id: data.id,
                              data: {
                                note: e.currentTarget.value,
                                editUserId: user?.id
                              }
                            }
                          })
                        }}
                        defaultValue={data.note ?? undefined}
                      />
                    </Td>
                    <Td textAlign="center">
                      {data.addCount.toString() != '0' && data.addCount}
                    </Td>
                    <Td textAlign="center">
                      {data.reduceCount.toString() != '0' && data.reduceCount}
                    </Td>
                    <Td textAlign="center">
                      {data.bookDate
                        ? dayjs(data.bookDate).format('YY/MM/DD')
                        : ''}
                      {data.bookDate &&
                        dayjs(data.bookDate).diff(new Date(), 'day') <= -1 && (
                          <Text fontSize="xx-small">期限が切れています</Text>
                        )}
                    </Td>
                    <Td textAlign="center">
                      <Box
                        display="flex"
                        justifyContent="space-around"
                        visibility={
                          data.isTemp && hoverIndex == i ? 'visible' : 'hidden'
                        }
                      >
                        <DeleteIcon
                          title="削除"
                          cursor="pointer"
                          fontSize="lg"
                          color="red"
                          onClick={async () => {
                            const res = confirm(
                              `この明細を削除しますか？\n入出庫日:${dayjs(
                                data.date
                              ).format('YY/MM/DD')}`
                            )
                            if (res) {
                              await deleteHistory(data.id).then(() => {
                                refetch()
                              })
                            }
                          }}
                        />
                      </Box>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>
        <Button
          type="submit"
          bgColor="green.200"
          mt="10px"
          onClick={(e) => {
            e.preventDefault()
            if (!item?.id) {
              alert('itemIdが存在しません')
              return
            }
            setEditMode('新規作成')
            setEditHistoryId(undefined)
            onModalOpen()
          }}
        >
          ＋新規追加
        </Button>
      </VStack>
      <aside>
        <RightDrawer isOpen={isRightOpen} onClose={onRightClose} width="30vw">
          {detailId && <HistoryDetail id={detailId} />}
        </RightDrawer>
      </aside>
      {item && (
        <EditHistoryModal
          isOpen={isModalOpen}
          onClose={onModalClose}
          itemId={item.id}
          mode={mode}
          unit={item.unitName}
          onDone={() => {
            onModalClose()
            refetch()
          }}
        />
      )}
    </>
  )
}

export default HistoryListPage
