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
} from "@chakra-ui/react"
import Footer from "~/components/Footer"
import usePageTitle from '~/hooks/usePageTitle'
import { apiClient }from '~/utils/apiClient'
import { useEffect, useState } from 'react'
import { IssueProps } from '~/server/domain/entity/issue'

const Home = () => {
  const { setTitle } = usePageTitle()
  setTitle("TOP (入荷状況)")

  const [issues, setIssues] = useState<IssueProps[]>();
  useEffect(() => {
    (async() => {
      const response = await apiClient.issue.get({query: { isStored: false}})
      const data = await response.body
      setIssues(data)
    })()
  }, [])

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
              issues.map((issue) => (
                issue.issueItems.map((item, i) => (
                  <Tr key={i}>
                  <Td>{issue.managedId}</Td>
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
      <Footer>
    </Footer>
    </div>
    </>
  )
}

export default Home
