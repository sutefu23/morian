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
  useDisclosure,
} from "@chakra-ui/react"
import Footer from "~/components/Footer"
import RightDrawer from '~/components/drawer/rightDrawer'
import BottomDrawer from '~/components/drawer/bottomDrawer'
import usePageTitle from '~/hooks/usePageTitle'
import { apiClient }from '~/utils/apiClient'
import { useEffect, useState } from 'react'
import { IssueProps } from '~/server/domain/entity/issue'
import Register from './item/register'
import useStock from '~/hooks/useStock'
import { Decimal } from 'decimal.js'
import IssueDetail from "./item/issueDetail"

const Home = () => {
  const { setTitle } = usePageTitle()
  setTitle("TOP (入荷状況)")

  const [issues, setIssues] = useState<IssueProps[]>()
  const [issueIndex, setIssueIndex ] = useState<number>(0)
  const [itemIndex, setItemIndex ] = useState<number>(0)

  useEffect(() => {
    (async() => {
      const response = await apiClient.issue.get({query: { isStored: false}})
      const data = await response.body
      setIssues(data)
    })()
  }, [])

  const { setStockData } = useStock()

  const {isOpen: isRightOpen, onOpen: onRightOpen, onClose: onRightClose} = useDisclosure()
  const {isOpen: isBottomOpen, onOpen: onBottomOpen, onClose: onBottomClose} = useDisclosure()
  return (
    <>
    <div className={styles.container}>
      <main className={styles.main}>
      </main>
      <aside>
        <Sidebar></Sidebar>
      </aside>

      <Table variant="striped" colorScheme="gray" >
        <Thead>
          <Tr>
            <Th>管理番号</Th>
            <Th>仕入先</Th>
            <Th>希望納期</Th>
            <Th>納入場所</Th>
            <Th>内部備考</Th>
            <Th>樹種</Th>
            <Th>材種</Th>
            <Th>グレード</Th>
            <Th>仕様</Th>
            <Th>寸法</Th>
            <Th>入数</Th>
            <Th>数量</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
            {
              issues &&
              issues.map((issue, i) => (
                issue.issueItems.map((item, j) => (
                  <Tr key={j}>
                  <Td>
                    <Button onClick={() => {
                      setIssueIndex(i)
                      setItemIndex(j)
                      onRightOpen()
                      }}>
                    {issue.managedId}
                    </Button>
                    </Td>
                  <Td>{issue.supplierName}</Td>
                  <Td>{issue.expectDeliveryDate}</Td>
                  <Td>{issue.deliveryPlaceName}</Td>
                  <Td>{issue.innerNote}</Td>
                  <Td>{item.woodSpeciesName}</Td>
                  <Td>{item.itemTypeName}</Td>
                  <Td>{item.gradeName}</Td>
                  <Td>{item.spec}</Td>
                  <Td>{item.length}{(item.thickness)?`*${item.thickness}`:""}{(item.width)?`*${item.width}`:""}</Td>
                  <Td>{item.packageCount}</Td>
                  <Td>{item.count}{item.unitName}</Td>
                  <Td>
                  <Button ml="5" bgColor="blue.100"
                    onClick={(e) => {
                      e.preventDefault()
                      setStockData({
                        lotNo: "",
                        woodSpeciesId: item.woodSpeciesId?? undefined,
                        itemTypeId: item.itemTypeId,
                        supplierId: issue.supplierId,
                        supplierName: issue.supplierName,
                        gradeId: item.gradeId ?? undefined,
                        length: item.length ?? undefined,
                        thickness: item.thickness ?? undefined,
                        width: item.width ?? undefined,
                        packageCount: new Decimal(item.packageCount.toString()) ?? undefined,
                        spec: item.spec ?? undefined,
                        manufacturer: item.manufacturer ?? undefined,
                        warehouseId: undefined,
                        arrivalDate: undefined,
                        cost: new Decimal(item.cost.toString()),
                        costUnitId: item.costUnitId,
                        count: new Decimal(item.count.toString()),
                        unitId: item.unitId,
                        costPackageCount: new Decimal(item.costPackageCount.toString()),
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
      <aside >
        <RightDrawer
        isOpen={isRightOpen} onClose={onRightClose}
        width="30vw"
        >
          {
          issues &&
          <IssueDetail item={issues[issueIndex].issueItems[itemIndex]} issue={issues[issueIndex]}></IssueDetail>
          }
        </RightDrawer>
      </aside>
      <Footer>
        <BottomDrawer title="入庫登録" isOpen={isBottomOpen} onClose={onBottomClose} height="40vw">
          {
            issues &&
           <Register isFromIssue={true}></Register>
          }
        </BottomDrawer>
      </Footer>
    </div>
    </>
  )
}

export default Home
