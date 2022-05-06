import React, { useState, useCallback } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Avatar,
  FormControl,
  InputRightElement,
  useDisclosure
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useRouter } from "next/router";
import Dialog from '~/components/feedback/dialog'
import useUser from '~/hooks/useUser'

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Login = () => {
  const [userId, setUserId] = useState<string>("")
  const [userPass, setUserPass] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const { isOpen, onOpen : ModalOpen, onClose } = useDisclosure()
  const handleShowClick = () => setShowPassword(!showPassword)
  const { setUser, login } = useUser()
  const router = useRouter()

  const handleLogin = useCallback(
    async (e:React.MouseEvent) => {
      if (!userId) {
        setErrorMessage("ユーザーIdを入力してください。")
        ModalOpen()
        return
      }
      if (!userPass) {
        setErrorMessage("パスワード入力してください。")
        ModalOpen()
        return
      }
      e.preventDefault()
      try{
        const user = await login({userId: Number(userId), userPass })
        if (user && !(user instanceof Error)){
          setUser(user)
          router.push('/')
        }
      }catch(error){
        setErrorMessage("ログインできませんでした。")
        console.error(error)
        ModalOpen()
        return
      }
    },
    [userId, userPass],
  )
  if(isOpen) return <Dialog message={errorMessage} isOpen onClose={onClose}/>
  return (
    <Flex flexDirection="column" width="100wh" height="100vh"  justifyContent="center" alignItems="center">
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading >モリアン在庫管理ログイン</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
            <Stack
              spacing={4}
              p="1rem"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                  >
                    <CFaUserAlt color="gray.300" />
                  </InputLeftElement>
                  <Input 
                  placeholder="ID" 
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                  >
                    <CFaLock color="gray.300" />
                  </InputLeftElement>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={userPass}
                    onChange={(event) => setUserPass(event.target.value)}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                width="full"
                onClick={handleLogin}
              >
                Login
              </Button>
            </Stack>
        </Box>
      </Stack>
    </Flex>
  )
}

export default Login