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
  Link,
  Avatar,
  FormControl,
  InputRightElement
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { setCookie } from 'nookies'
import { apiClient } from '~/utils/apiClient'
import { useRouter } from "next/router";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Login = () => {
  const [userId, setUserId] = useState<string>("")
  const [userPass, setUserPass] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)

  const handleShowClick = () => setShowPassword(!showPassword)
  const router = useRouter()

  const handleLogin = useCallback(
    async (e:React.MouseEvent) => {
      if (!userId) return
      if (!userPass) return
      e.preventDefault()
      const res = await apiClient.login.post({ body: { id: Number(userId), pass: userPass} })
      if (res.status == 201){
        setCookie(null, 'token', res.body.token, {
          maxAge: 30 * 24 * 60 * 60,
        })
        router.push('/')
      }
      return false
    },
    [userId, userPass],
  )
  return (
    <Flex flexDirection="column" width="100wh" height="100vh" backgroundColor="gray.200" justifyContent="center" alignItems="center">
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">モリアン在庫管理ログイン</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
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
                    color="gray.300"
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
                colorScheme="teal"
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