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


const Home = () => {
  const { setTitle } = usePageTitle()
  setTitle("TOP (入荷状況)")
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
          <Tr>
            <Td>MR-742-１</Td>
            <Td>北材商事株式会社</Td>
            <Td>2月上旬</Td>
            <Td>本社入れ</Td>
            <Td>節有を含む</Td>
            <Td>タモ</Td>
            <Td>フリー板</Td>
            <Td>Aグレード</Td>
            <Td>ウレタン塗装</Td>
            <Td>4200*500*20</Td>
            <Td>1.2㎡</Td>
            <Td>4㎥</Td>
            <Td>
            <Button ml="5" bgColor="blue.100"
              onClick={(e) => {
                e.preventDefault()
                }
              }
            >入庫</Button>
            </Td>
          </Tr>
          <Tr>
            <Td>MR-742-１</Td>
            <Td>北材商事株式会社</Td>
            <Td>2月上旬</Td>
            <Td>倉庫入れ</Td>
            <Td></Td>
            <Td>欅</Td>
            <Td>フローリング</Td>
            <Td>乱尺</Td>
            <Td>ウレタン塗装</Td>
            <Td>1800*500*20</Td>
            <Td>1.2㎡</Td>
            <Td>30束</Td>
            <Td>
            <Button ml="5" bgColor="blue.100"
              onClick={(e) => {
                e.preventDefault()
                }
              }
            >入庫</Button>
            </Td>
          </Tr>
          <Tr>
            <Td>MR-742-１</Td>
            <Td>日本アクセス</Td>
            <Td>月上旬</Td>
            <Td>本社入れ</Td>
            <Td>節有を含む</Td>
            <Td>タモ</Td>
            <Td>フリー板</Td>
            <Td>B</Td>
            <Td>無塗装</Td>
            <Td>4200*500*30</Td>
            <Td>1.3㎡</Td>
            <Td>2㎥</Td>
            <Td>
              <Button ml="5" bgColor="blue.100"
              onClick={(e) => {
                e.preventDefault()
                }
              }
              >入庫</Button>
            </Td>
          </Tr>
        </Tbody>
      </Table>
      <Footer>
    </Footer>
    </div>
    </>
  )
}

export default Home
