import { useRouter } from 'next/router'
import { Heading, Flex, Box, Spacer, VStack, FormLabel, Input } from "@chakra-ui/react"
import Link from 'next/link'

const HistoryListPage = () => {
  const router = useRouter()
  const { itemTypeId, woodSpeciesId } = router.query

  const PageHeader = () => {
    return (
      <>
      <VStack height="20vh">
        <Heading as="h3" size="lg">
          在庫詳細
        </Heading>
        <Flex h="10">
          <Box>
            <FormLabel>ロットNo</FormLabel>
            <FormLabel>F-254</FormLabel>
          </Box>
          <Spacer />
          <Box>
            <FormLabel>樹種</FormLabel>
            <FormLabel>レッドシダー</FormLabel>
          </Box>
          <Spacer />
          <Box>
            <FormLabel>材種</FormLabel>
            <FormLabel>フローリング</FormLabel>
          </Box>
          <Box>
            <FormLabel>寸法</FormLabel>
            <FormLabel>1820*90*15</FormLabel>
          </Box>
          <Box>
            <FormLabel>在庫数</FormLabel>
            <FormLabel>0</FormLabel>
          </Box>

        </Flex>
        <Flex h="10">
          <Box>
            <FormLabel>入荷日</FormLabel>
            <FormLabel>2020/8/23</FormLabel>
          </Box>
          <Spacer />
          <Box>
            <FormLabel>入荷予定日</FormLabel>
            <FormLabel>2020/8/23</FormLabel>
          </Box>
          <Spacer />
          <Box>
            <FormLabel>倉庫</FormLabel>
            <FormLabel>本社</FormLabel>
          </Box>
          <Spacer />
          <Box>
            <FormLabel>仮在庫数</FormLabel>
            <FormLabel>80</FormLabel>
          </Box>
        </Flex>
      </VStack>
      </>
    )
  }

  const PageBody = () => {
    return (
      <ul></ul>
    )
  }
  return (
    <>
    <PageHeader/>
    <PageBody/>
    </>
  )
}

export default HistoryListPage