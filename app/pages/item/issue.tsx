import { HStack, Box, VStack, InputGroup, Input, InputLeftAddon} from "@chakra-ui/react"
import { WoodSpeciesSelect, ItemTypeSelect, SupplierSelect } from "~/components/select/"
import StatusBar from "~/components/feedback/statusBar"
import usePageTitle from '~/hooks/usePageTitle'
import useUser from "~/hooks/useUser"
import { Supplier } from "~/server/domain/entity/stock"

export interface Item {
  label: string;
  value: string;
}

const Register = () => {
  const { setTitle } = usePageTitle()
  setTitle("発注")
  const { user } = useUser()
  if(user && user.id !== 1){
    return <StatusBar status="error" message="発注権限のあるユーザーではありません"/>
  } 
  
  return (
    <>
    <VStack>
      <HStack>
        <SupplierSelect onSelect={() => { return}}/>
      </HStack>
    </VStack>
    <VStack>
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon>樹種</InputLeftAddon>
            <WoodSpeciesSelect onSelect={() => { return}}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon>材種</InputLeftAddon>
            <ItemTypeSelect onSelect={() => { return}}/>
          </InputGroup>
        </Box>
      </HStack>
    </VStack>
    </>
  )
}

export default Register