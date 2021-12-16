import { Heading, HStack, Box, VStack, InputGroup, Input, InputLeftAddon } from "@chakra-ui/react"

const PageHeader = () => {
  return (
    <>
    <VStack bgColor="aliceblue">
    <Heading as="h1" size="md" mt="1" >
        在庫一覧
      </Heading>
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
    </>
  )
}

export default PageHeader