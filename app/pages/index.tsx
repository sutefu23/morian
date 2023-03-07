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
  Heading
} from '@chakra-ui/react'
import usePageTitle from '~/hooks/usePageTitle'
import { apiClient } from '~/utils/apiClient'
import { useAspidaQuery } from '@aspida/react-query'
import NextLink from 'next/link'
import dayjs from 'dayjs'

const Home = () => {
  const { setTitle } = usePageTitle()
  setTitle('TOP (最近登録順)')
  const { data: items } = useAspidaQuery(apiClient.itemList, {
    query: {
      orderBy: 'desc',
      limit: 30
    }
  })

  return (
    <>
      <div className={styles.container}>
        <aside>
          <Sidebar></Sidebar>
        </aside>
        <main className={styles.main}>
          {!items || items?.length == 0 ? (
            <Heading textAlign="center" mt="20px">
              現在入荷情報はありません
            </Heading>
          ) : (
            <Table variant="striped" colorScheme="gray">
              <Thead>
                <Tr>
                  <Th>管理番号</Th>
                  <Th>樹種</Th>
                  <Th>分類</Th>
                  <Th>グレード</Th>
                  <Th>仕様</Th>
                  <Th>寸法</Th>
                  <Th>入数</Th>
                  <Th>数量</Th>
                  <Th>仕入先</Th>
                  <Th>倉庫</Th>
                  <Th>備考</Th>
                  <Th>登録日</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {items &&
                  items.map((item, i) => (
                    <Tr key={i}>
                      <Td>{item.lotNo}</Td>
                      <Td>{item?.woodSpeciesName}</Td>
                      <Td>{item?.itemTypeName}</Td>
                      <Td>{item?.gradeName}</Td>
                      <Td>{item?.spec}</Td>
                      <Td>
                        {item?.length}
                        {item?.thickness ? `*${item?.thickness}` : ''}
                        {item?.width ? `*${item?.width}` : ''}
                      </Td>
                      <Td>
                        {item?.packageCount}
                        {item?.packageCountUnitName}
                      </Td>
                      <Td>
                        {item?.count}
                        {item.unitName}
                      </Td>
                      <Td>{item.supplierName}</Td>
                      <Td>{item.warehouseName}</Td>
                      <Td>{item.note}</Td>
                      <Td>{dayjs(item.createdAt).format('YY/MM/DD')}</Td>
                      <Td textAlign="right">
                        <NextLink href={`/history/${item.lotNo}`}>
                          <Button ml="5" bgColor="blue.100">
                            詳細
                          </Button>
                        </NextLink>
                      </Td>
                    </Tr>
                  ))}
              </Tbody>
            </Table>
          )}
        </main>
      </div>
    </>
  )
}

export default Home
