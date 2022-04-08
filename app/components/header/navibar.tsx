import {
  Flex,
  Box,
  Spacer,
  Text,
  Button,
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
        <HamburgerIcon  w={8} h={8} cursor="pointer" onClick={() => setIsOpenSidebar(true)}></HamburgerIcon>

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
      ユーザー：{user?.name}
      {<Button
      ml={5}
      onClick={() => {handleLogout()}}>ログアウト</Button>}
    </Box>
  </Flex>
  )
}
export default Navibar
