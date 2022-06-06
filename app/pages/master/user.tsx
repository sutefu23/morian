import { useAspidaQuery } from "@aspida/react-query"
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Input,
  Container,
  Button,
  Flex,
  InputRightElement,
  InputGroup
} from "@chakra-ui/react"
import { produce } from "immer"
import { useCallback, useState } from "react"
import usePageTitle from "~/hooks/usePageTitle"
import { User } from "~/server/domain/entity/user"
import { apiClient } from "~/utils/apiClient"

const UserManage = () => {
  const { setTitle } = usePageTitle()
  const [users, setUsers ] = useState<User[]>([])
  const [newUser, setNewUser] = useState<User>()
  const [showIds, setShowIds] = useState<User["id"][]>([])
  setTitle(`ユーザー 設定`)

  useAspidaQuery(apiClient.user,{onSuccess:async (users) => {
    const maxId = users.reduce((prevId, curr)=>(
      prevId < curr.id ? curr.id : prevId
    ), 0)

    setNewUser({
      id:maxId + 1,
      name: newUser?.name || "",
      pass:"",
      enable: true
    })
    const data = await apiClient.user.get()
    const body = data.body
    setUsers(body)
  }})


  const handleSubmit = useCallback(async ()=>{
    if(!newUser ) return
    if(!newUser?.name || newUser.name.length === 0){
      alert("名称は必須です。")
      return
    } 
    if(!isValidPassword(newUser.pass)) return 

    await apiClient.user._id(0).post({body:{body:newUser}})
    
    window.location.reload()
  },[newUser])

  const handleModifyPass = useCallback(async (id:number, newPass:string) => {
    if(!isValidPassword(newPass)) return 

    if(confirm("パスワードを変更します\nよろしいですか。")){
      await apiClient.user._id(id).patch({body: {id, body: { pass: newPass }}})
    
      window.location.reload()
    }
  },[users])

  const handleShowClick = (id?:User["id"]) => {
    if(!id) return

    if(showIds.findIndex((i => i === id)) === -1){
      setShowIds([...showIds, id])
    }else{
      setShowIds(showIds.filter(i => i !== id))
    }
  }

  const isValidPassword = (newPass: string) =>{
    if(!newPass || newPass.length === 0){
      alert("パスワードが入力されていません。")
      return false
    }
    if (newPass.length < 8) {
      alert("パスワードは8文字以上にしてください")
      return false
    }
    if (newPass.search(/[a-z]/) < 0) {
      alert("パスワードにアルファベットを含めてください。.")
      return false
    }
    if (newPass.search(/[A-Z]/) < 0) {
      alert("パスワードに大文字を含めてください。.")
      return false
    }
    if (newPass.search(/[0-9]/) < 0) {
      alert("パスワードに数字を含めてください。")
      return false
    }
    return true
  } 
  return (
    <>
    <Container
      mt="50px"
      border="solid 1px #eee"
      w="60vw"
      maxW="60vw"
    >
    <Table variant="striped" colorScheme="gray" w="100%">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>名称</Th>
            <Th>パスワード</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            users.map(user => (
              <Tr key={user.id}>
                <Td>
                  <Text ml="10px">
                    {( '0000' + user.id ).slice( -4 )}
                  </Text>
                </Td>
                <Td>
                  {user.name}
                </Td>
                <Td>
                  <Flex>

                  <InputGroup>
                    <Input 
                    width="70%"
                    bgColor="white"
                    type={showIds.findIndex((i => i === user.id)) > -1 ? "text" : "password"}
                    onChange={(e) => {
                      const newUsers = produce(users, (draft)=>{
                        const index = users.findIndex(u => u.id === user.id)
                        draft[index].pass = e.target.value
                      })
                      setUsers(newUsers)
                    }}
                    ></Input>
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={() => handleShowClick(user.id)}>
                        {showIds.findIndex((i => i === user.id)) > -1 ? "隠す" : "表示"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <Button
                    bgColor="red.100"
                    onClick={(e)=>{
                      e.preventDefault()
                      const index = users.findIndex(u => u.id === user.id)
                      handleModifyPass(user.id, users[index].pass)
                    }}
                  >Pass変更</Button>
                  </Flex>

                </Td>
              </Tr>    
            )
            )
        }
         <Tr>
            <Td>
            <Input 
              bgColor="white"
              type="text"
              readOnly
              defaultValue={newUser?.id&&( '0000' + newUser.id ).slice( -4 )}
              ></Input>
            </Td>
            <Td>
            <Input 
              bgColor="white"
              type="text"
              defaultValue={newUser?.name}
              onChange={(e)=>{
                  setNewUser({...newUser!, name: e.currentTarget.value})
              }}
              ></Input>
            </Td>
            <Td>
              <Flex >
                <InputGroup>
                  <Input 
                  bgColor="white"
                  type={showIds.findIndex((i => i === newUser?.id)) > -1 ? "text" : "password"}
                  width="70%"
                  onChange={(e)=>
                  {
                    setNewUser({...newUser!, pass: e.currentTarget.value})
                  }}
                  defaultValue={newUser?.pass}
                  ></Input>
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={() => handleShowClick(newUser?.id)}>
                      {showIds.findIndex((i => i === newUser?.id)) > -1 ? "隠す" : "表示"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <Button
                  bgColor="green.100"
                  onClick={(e)=>{
                    e.preventDefault()
                    handleSubmit()
                  }}
                >新規登録</Button>
              </Flex>
            </Td>
          </Tr>  
        </Tbody>
      </Table>
      </Container>
    </>
  )
}
export default UserManage


