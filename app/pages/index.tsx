import styles from '~/styles/Home.module.css'
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
  useDisclosure,
  Input
} from "@chakra-ui/react"
import RightDrawer from '~/components/drawer/rightDrawer'
import BottomDrawer from '~/components/drawer/bottomDrawer'
import usePageTitle from '~/hooks/usePageTitle'
import { apiClient }from '~/utils/apiClient'
import { useCallback, useState } from 'react'
import Register from './item/register'
import useStock from '~/hooks/useStock'
import { Decimal } from 'decimal.js'
import type { Decimal as ServerDecimal } from "server/node_modules/decimal.js"
import IssueDetail from "./issue/issueDetail"
import { useAspidaQuery } from '@aspida/react-query'

const Home = () => {
  const { setTitle } = usePageTitle()
  setTitle("TOP (入荷状況)")

  const [issueIndex, setIssueIndex ] = useState<number>(0)
  const [itemIndex, setItemIndex ] = useState<number>(0)

  const {data:issues, refetch} = useAspidaQuery(apiClient.issue, {query: { isStored: false}})
  const {data:itemTypes} = useAspidaQuery(apiClient.master.itemType)

  const { setStockData } = useStock()
  const {isOpen: isRightOpen, onOpen: onRightOpen, onClose: onRightClose} = useDisclosure()
  const {isOpen: isBottomOpen, onOpen: onBottomOpen, onClose: onBottomClose} = useDisclosure()

  const handleRegister = useCallback(()=>{
    onBottomClose()
    refetch()
  },[])

  return (
    <>
    <div className={styles.container}>
      <aside>
        <Sidebar></Sidebar>
      </aside>
      <main className={styles.main}>
      {!issues || issues?.length ==0 || issues[0]?.issueItems?.length == 0 
        ?
        <Heading textAlign="center" mt="20px">現在発注情報はありません</Heading>
        :
        <Table variant="striped" colorScheme="gray" >
        <Thead>
          <Tr>
            <Th>管理番号</Th>
            <Th>樹種</Th>
            <Th>材種</Th>
            <Th>グレード</Th>
            <Th>仕様</Th>
            <Th>寸法</Th>
            <Th>入数</Th>
            <Th>数量</Th>
            <Th>仕入先</Th>
            <Th>希望納期</Th>
            <Th>納入場所</Th>
            <Th>発注内部備考</Th>
            <Th>入荷予定</Th>
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
                  <Td>{item.itemNote??undefined}</Td>
                  <Td textAlign="right">
                  <Button ml="5" bgColor="blue.100"
                    onClick={(e) => {
                      e.preventDefault()
                      const lotPrefix = itemTypes?.find(itm => itm.id === item.itemTypeId)?.prefix
                      setStockData({
                        lotNo: `${lotPrefix}-`,
                        woodSpeciesId: item.woodSpeciesId?? undefined,
                        woodSpeciesName: item.woodSpeciesName?? undefined,
                        itemTypeId: item.itemTypeId,
                        itemTypeName: item.itemTypeName,
                        supplierId: issue.supplierId,
                        supplierName: issue.supplierName,
                        gradeId: item.gradeId ?? undefined,
                        gradeName: item.gradeName ?? undefined,
                        length: item.length ?? undefined,
                        thickness: item.thickness ?? undefined,
                        width: item.width ?? undefined,
                        packageCount: new Decimal(item.packageCount.toString()) as unknown as ServerDecimal?? undefined,
                        spec: item.spec ?? undefined,
                        manufacturer: item.manufacturer ?? undefined,
                        warehouseId: undefined,
                        warehouseName: undefined,
                        arrivalDate: undefined,
                        cost: new Decimal(item.cost.toString()) as unknown as ServerDecimal,
                        costUnitId: item.costUnitId,
                        costUnitName: item.costUnitName,
                        count: new Decimal(item.count.toString()) as unknown as ServerDecimal,
                        unitId: item.unitId,
                        unitName: item.unitName,
                        costPackageCount: new Decimal(item.costPackageCount.toString()) as unknown as ServerDecimal,
                        issueItemId: item.id,
                        enable: true
                      })
                      onBottomOpen()
                      }
                    }
                  >入庫</Button>
                  </Td>
                  </Tr>
                ))
              ))
            }
        </Tbody>
      </Table>
      }
      </main>

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
            onSuccessDelete={refetch}
            ></IssueDetail>
          }
        </RightDrawer>
      </aside>
      <BottomDrawer title="入庫登録" isOpen={isBottomOpen} onClose={onBottomClose} height="40vw">
          {
            issues &&
           <Register isFromIssue={true} onSuccess={()=>{handleRegister()}}></Register>
          }
        </BottomDrawer>
    </div>
    </>
  )
}

export default Home
