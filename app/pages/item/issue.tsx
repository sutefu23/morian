import { HStack, Box, VStack, InputGroup, Input, InputLeftAddon} from "@chakra-ui/react"
import { useState } from 'react'
import { CUIAutoComplete } from "chakra-ui-autocomplete"
import { WoodSpeciesSelect, ItemTypeSelect } from "~/components/select/"
import StatusBar from "~/components/feedback/statusBar"
import usePageTitle from '~/hooks/usePageTitle'
import useUser from "~/hooks/useUser"
import zIndex from "@material-ui/core/styles/zIndex"

export interface Item {
  label: string;
  value: string;
}
const countries = [
  { value: "ghana", label: "Ghana" },
  { value: "nigeria", label: "Nigeria" },
  { value: "kenya", label: "Kenya" },
  { value: "southAfrica", label: "South Africa" },
  { value: "unitedStates", label: "United States" },
  { value: "canada", label: "Canada" },
  { value: "germany", label: "Germany" }
];

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
      <CUIAutoComplete
          labelStyleProps={{
            display:"none",
          }}
          inputStyleProps={{
            minWidth:"300px",
          }}

          listStyleProps={{
            position: "absolute",
            minWidth:"300px",
            backgroundColor:"white",
            zIndex:"1"
          }}

          label=""
          placeholder="仕入先"
          items={countries}

        />
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