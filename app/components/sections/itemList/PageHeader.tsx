import { Heading, HStack, Box, VStack, InputGroup, Input, InputLeftAddon } from "@chakra-ui/react"

const PageHeader = () => {
  return (
    <>
    <VStack bgColor="aliceblue">
      <Heading as="h1" size="md" mt="1" >
        在庫詳細
      </Heading>
      <HStack width="95vw">
        <Box>
          <InputGroup>
            <InputLeftAddon>ロットNo</InputLeftAddon>
            <Input value="F-254" readOnly/>
          </InputGroup>
        </Box>
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
        <Box>
          <InputGroup>
            <InputLeftAddon>グレード</InputLeftAddon>
            <Input value="無節上小節" readOnly/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon>仕様</InputLeftAddon>
            <Input value="材料支給　杉の香用" readOnly/>
          </InputGroup>
        </Box>
      </HStack>
      <HStack width="95vw">
        <Box>
          <InputGroup>
            <InputLeftAddon>仕入先</InputLeftAddon>
            <Input value="日本インシュレーション" readOnly/>
          </InputGroup>
        </Box>
        <Box w="150px">
          <InputGroup>
            <InputLeftAddon>入数</InputLeftAddon>
            <Input value="2.87" readOnly/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon>寸法</InputLeftAddon>
            <Input value="1820*90*15" readOnly/>
          </InputGroup>
        </Box>
        <Box w="150px">
          <InputGroup>
            <InputLeftAddon>単位</InputLeftAddon>
            <Input value="枚" readOnly/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon>製造元</InputLeftAddon>
            <Input value="中国" readOnly/>
          </InputGroup>
        </Box>
      </HStack>
      <HStack width="95vw">
        <Box>
          <InputGroup>
            <InputLeftAddon>入荷日</InputLeftAddon>
            <Input value="2020/8/23" readOnly/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon>入荷予定日</InputLeftAddon>
            <Input onChange={(e) => console.log(e.target.value)}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon>倉庫</InputLeftAddon>
            <Input value="本社" readOnly/>
          </InputGroup>
        </Box>
        <Box w="200px">
          <InputGroup>
            <InputLeftAddon>仮在庫数</InputLeftAddon>
            <Input value="10" textAlign="right" readOnly/>
          </InputGroup>
        </Box>
        <Box w="180px">
          <InputGroup>
            <InputLeftAddon>在庫数</InputLeftAddon>
            <Input value="40" textAlign="right" readOnly/>
          </InputGroup>
        </Box>
      </HStack>
      <HStack width="95vw">
        <Box>
          <InputGroup>
            <InputLeftAddon>備考</InputLeftAddon>
            <Input onChange={(e) => {console.log(e.target.value)}}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon>不良品備考</InputLeftAddon>
            <Input onChange={(e) => {console.log(e.target.value)}}/>
          </InputGroup>
        </Box>
        <Box w="220px">
          <InputGroup>
            <InputLeftAddon>原価</InputLeftAddon>
            <Input value="2000" readOnly/>
          </InputGroup>
        </Box>
        <Box w="180px">
          <InputGroup>
            <InputLeftAddon>原価単位</InputLeftAddon>
            <Input value="平米" readOnly/>
          </InputGroup>
        </Box>
      </HStack>
    </VStack>
    </>
  )
}

export default PageHeader