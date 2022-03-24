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
import { useRouter } from 'next/router'


const Home = () => {
  const router = useRouter()
  const lotNo = ''

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
            <Th>備考</Th>
            <Th>樹種</Th>
            <Th>材種</Th>
            <Th>グレード</Th>
            <Th>仕様</Th>
            <Th>寸法</Th>
            <Th>入数</Th>
            <Th>数量</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>21/4/1</Td>
            <Td>バラ出荷</Td>
            <Td>見積番号ｘｘｘｘ</Td>
            <Td>1000</Td>
            <Td></Td>
            <Td>ケース</Td>
            <Td>田中</Td>
            <Td>21/2/31</Td>
            <Td>平川</Td>
            <Td>平川</Td>
            <Td><Button colorScheme='blue' onClick={() => { router.push(`/history/${lotNo}`)}}>入庫</Button></Td>
          </Tr>
        </Tbody>
      </Table>
    </div>
    </>
  )
}

export default Home
