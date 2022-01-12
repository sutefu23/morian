import {
  Flex,
  Box,
  Spacer,
  Text,
  Heading,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import React, { useEffect, useCallback} from 'react'
import useUser from '~/hooks/useUser'
import useSidebar from '~/hooks/useSidebar'
import usePageTitle from '~/hooks/usePageTitle'
import { useRouter }from 'next/router'
import { destroyCookie } from 'nookies'


const Navibar = () => {
  const { isOpen: isOpenSidebar, setIsOpen: setIsOpenSidebar } = useSidebar()
  const { title } = usePageTitle() 
  const { user, setUser } = useUser()
  const router = useRouter()

  const handleLogout = useCallback(
    () => {
      setUser(null)
      destroyCookie(null, 'token')
      router.push('/login')
    },
    [],
  )
  if(!user){
    return <></>
  }
  return (
    <Flex justifyContent="space-between">
    <Box p='4' >
      
      {
        isOpenSidebar ?      
        <CloseIcon onClick={() => setIsOpenSidebar(false)}></CloseIcon>
        :
        <HamburgerIcon cursor="pointer" onClick={() => setIsOpenSidebar(true)}></HamburgerIcon>

      }
    </Box>
    {title ?
      <Heading as="h1" size="md" mt="4" >
          {title}
      </Heading>
      :
      <Spacer/> 
    }
    <Box p='4'>
      <Text>ログイン：{user?.name}</Text>
      {/* <Text borderBottom={"solid 1px"} cursor={"pointer"}
      onClick={() => {handleLogout()}}>ログアウト</Text> */}
    </Box>
  </Flex>
  )
}
export default Navibar
