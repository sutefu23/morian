import { HStack, Box, VStack, InputGroup, Input, InputLeftAddon
  ,Table, Thead, Tbody, Tr, Th, Td,} from "@chakra-ui/react"
import usePageTitle from '~/hooks/usePageTitle'

const Register = () => {

  const { setTitle } = usePageTitle()
  setTitle("新規登録")

  return (
    <>
    <VStack bgColor="aliceblue">
      <HStack width="95vw">
        <Box>
          <InputGroup>
            <InputLeftAddon>樹種</InputLeftAddon>
            <Input value="レッドシダー" readOnly/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon>材種</InputLeftAddon>
            <Input value="フローリング" readOnly/>
          </InputGroup>
        </Box>
      </HStack>
    </VStack>
    <Table variant="striped" colorScheme="gray" size='sm' w="150vw">
      <Thead>
        <Th>ロット番号</Th>
        <Th>樹種</Th>
        <Th>材種</Th>
        <Th>グレード</Th>
        <Th>仕様</Th>
        <Th>仕入先</Th>
        <Th>寸法</Th>
        <Th>入数</Th>
        <Th>数量</Th>
        <Th>製造元</Th>
        <Th>入荷日</Th>
        <Th>倉庫</Th>
        <Th>入荷予定日</Th>
        <Th>備考</Th>
        <Th>不良品備考</Th>
        <Th>原価単位数量</Th>
        <Th>原価</Th>
      </Thead>
      <Tbody>
        <Tr>
        <Td>S-20210809-1</Td>
        <Td>タモ</Td>
        <Td>集成材</Td>
        <Td>A</Td>
        <Td>ピッチ30ミリ</Td>
        <Td>北材商事</Td>
        <Td>4200*30*500</Td>
        <Td></Td>
        <Td>30枚</Td>
        <Td></Td>
        <Td>44417</Td>
        <Td>本社</Td>
        <Td></Td>
        <Td></Td>
        <Td></Td>
        <Td>0.063</Td>
        <Td>200000㎥</Td>
        </Tr>

      </Tbody>
    </Table>
    </>
  )
}

export default Register