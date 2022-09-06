import Sidebar from '~/components/navigation/sidebar'
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  HStack,
  Box,
  InputGroup, 
  useDisclosure,
  InputLeftAddon,
  Input
} from "@chakra-ui/react"
import dayjs from 'dayjs'
import RightDrawer from '~/components/drawer/rightDrawer'
import usePageTitle from '~/hooks/usePageTitle'
import { apiClient }from '~/utils/apiClient'
import { useState, useEffect, useCallback } from 'react'
import useIssue from '~/hooks/useIssue'
import useUser from '~/hooks/useUser'
import type { EditIssueData } from '~/hooks/useIssue'
import IssueDetail from "./issueDetail"
import { useAspidaQuery } from '@aspida/react-query'
import NextLink from "next/link"
import { SupplierSelect } from "../../components/select"

const IssueList = () => {
  
  const { setTitle } = usePageTitle()
  setTitle("過去発注情報検索")

  const [ issueIndex, setIssueIndex ] = useState<number>(0)
  const [ itemIndex, setItemIndex ] = useState<number>(0)
  const [ searchSupplierId, setSearchSupplierId ] = useState<number|undefined>(undefined)
  const [ searchDate, setSearchDate ] = useState<{fromDate:Date, toDate:Date}>({fromDate: dayjs().subtract(1, 'month').toDate(), toDate: dayjs().toDate()})

  const [ searchEnable, setSearchEnable ] = useState<boolean>(false)

  const { user } = useUser()

  const {data:issues, refetch} = useAspidaQuery(apiClient.issue, 
    {
      query: { supplierId: searchSupplierId, fromDate: searchDate.fromDate, toDate: searchDate.toDate },
      enabled:searchEnable,
      onSuccess: (data)=>{
        if(data.length === 0){
          alert("検索結果はありません。")
        }
      }
    }
  )

  const { setIssueData, resetIssueData } = useIssue()
  const [ selectIssueData, setSelectIssueData ] = useState<EditIssueData>({})
 
  const {isOpen: isRightOpen, onOpen: onRightOpen, onClose: onRightClose} = useDisclosure()

  const handleSearch = useCallback(()=>{
    if(!searchSupplierId) {
      alert("仕入先を入れてください。")
      return
    }
    setSearchEnable(true)
    refetch()
    setSearchEnable(false)
  },[searchSupplierId, searchDate])

  // 発注データがセットされたら遷移
  useEffect(() => {
    if(Object.keys(selectIssueData).length > 0){
      resetIssueData()
      const items = selectIssueData.issueItems?.map((item) => {
        return {
          ...item,
          id: undefined,
          IssueId:undefined,
          isStored:false,
          updateAt: undefined,
          createAt: undefined,
        }
      })
      setIssueData({...selectIssueData,
          id: undefined,
          managedId: undefined,
          date: new Date(),
          userId: user?.id,
          userName: user?.name,
          innerNote: "",
          issueItems:items,
        })
    }
 }, [selectIssueData])

  return (
    <>
    <div>
      <aside>
        <Sidebar></Sidebar>
      </aside>
      <HStack mt={10} mb={10}>
        <Box>
        <InputGroup>
            <InputLeftAddon bgColor="blue.100" ml="10" aria-required>発注日検索</InputLeftAddon>
            <Input
              defaultValue={dayjs(searchDate.fromDate).format('YYYY-MM-DD')}
              value={searchDate.fromDate ? dayjs(searchDate.fromDate).format('YYYY-MM-DD'): undefined}
              onChange={(e)=>{
                setSearchDate({...searchDate, fromDate: new Date(e.target.value)})
              }}
              type="date"/>
            <InputLeftAddon bgColor="transparent" border="none">～</InputLeftAddon>
            <Input   
              defaultValue={dayjs(searchDate.toDate).format('YYYY-MM-DD')}
              value={searchDate.toDate ? dayjs(searchDate.toDate).format('YYYY-MM-DD'): undefined}
              onChange={(e)=>{
                setSearchDate({...searchDate, toDate: new Date(e.target.value)})
              }}
              type="date"/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon bgColor="blue.100" ml="10" aria-required>仕入先検索</InputLeftAddon>
            <SupplierSelect   
              onSelect={
                (selected) => {
                  setSearchSupplierId(selected.id)}
              }
            />
          </InputGroup>
        </Box>
        <Box>
        <Button ml="10" onClick={handleSearch}>検索</Button>
        </Box>
      </HStack>
      {!issues || issues?.length ==0 || issues[0]?.issueItems?.length == 0 
        ?
        <Heading textAlign="center" mt="20px"></Heading>
        :
        <>
        <Table variant="striped" colorScheme="gray" >
        <Thead>
          <Tr>
            <Th>管理番号</Th>
            <Th>発注日</Th>
            <Th>樹種</Th>
            <Th>材種</Th>
            <Th>グレード</Th>
            <Th>仕様</Th>
            <Th>寸法</Th>
            <Th>入数</Th>
            <Th>数量</Th>
            <Th>仕入先</Th>
            <Th>納入場所</Th>
            <Th>発注内部備考</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
            {
              issues && 
              issues.map((issue, i) => (
                issue?.issueItems.length > 0 && 
                issue?.issueItems.map((item, j) => (
                  <Tr key={j}>
                  <Td>
                  <Button ml="5" bgColor="gray.200"
                    onClick={() => {
                      setIssueIndex(i)
                      setItemIndex(j)
                      onRightOpen()
                      }}>
                    {issue.managedId}
                    </Button>
                  </Td>
                  <Td>{dayjs(issue.date).format('YYYY-MM-DD')}</Td>
                  <Td>{item?.woodSpeciesName}</Td>
                  <Td>{item?.itemTypeName}</Td>
                  <Td>{item?.gradeName}</Td>
                  <Td>{item?.spec}</Td>
                  <Td>{item?.length}{(item?.thickness)?`*${item?.thickness}`:""}{(item?.width)?`*${item?.width}`:""}</Td>
                  <Td>{item?.packageCount}</Td>
                  <Td>{item?.count}{item.unitName}</Td>
                  <Td>{issue.supplierName}</Td>
                  <Td>{issue.expectDeliveryDate}</Td>
                  <Td>{issue.deliveryPlaceName}</Td>
                  <Td>{issue.innerNote}</Td>
                  <Td textAlign="right">
                  <NextLink
                    href={{
                      pathname:`/item/issue/`,
                    }}>
                  <Button ml="5" bgColor="pink.100"
                    onClick={(e) => {
                      setSelectIssueData(issue)
                    }}
                  >コピー作成</Button>
                  </NextLink>
                  </Td>
                  </Tr>
                ))
              ))
            }
        </Tbody>
      </Table>
      </>
      }

      <aside >
        <RightDrawer
        isOpen={isRightOpen} onClose={onRightClose}
        width="30vw"
        >
          {
          issues &&
          <IssueDetail 
            item={issues[issueIndex]?.issueItems[itemIndex]}
            issue={issues[issueIndex]}
            editable={false}
            onSuccessDelete={refetch}
            ></IssueDetail>
          }
        </RightDrawer>
      </aside>
    </div>
    </>
  )
}

export default IssueList