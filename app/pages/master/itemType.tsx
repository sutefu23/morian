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
  Flex
} from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import usePageTitle from "~/hooks/usePageTitle"
import { ItemTypeType } from "~/server/domain/entity/stock"
import { apiClient } from "~/utils/apiClient"

const ItemTypesManage = () => {
  const { setTitle } = usePageTitle()
  const [itemTypes, setItemTypes ] = useState<ItemTypeType[]>([])
  const [newItemTypes, setNewItemTypes] = useState<ItemTypeType>()

  useAspidaQuery(apiClient.master.itemType,{onSuccess: async (itemTypes) => {

    const maxId = itemTypes.reduce((prevId, curr)=>(
      prevId < curr.id ? curr.id : prevId
    ), 0)

    const maxOrder = itemTypes.reduce((prevOrder, curr)=>(
      prevOrder < curr.order ? curr.order : prevOrder 
    ), 0)
     
    setNewItemTypes({
      id:maxId + 1,
      name: newItemTypes?.name || "",
      prefix: newItemTypes?.prefix || "",
      order: maxOrder + 1
    })
    setItemTypes(itemTypes)
    setTitle(`材種 マスタ設定`)
  }})

  const handleSubmit = useCallback(async ()=>{
    if(!newItemTypes ) return

    if(!newItemTypes?.name || newItemTypes.name.length === 0){
      alert("名称は必須です。")
      return
    } 
    if(!newItemTypes?.order || !isFinite(newItemTypes.order)){
      alert("並び順は必須です。")
      return
    } 
    if(!newItemTypes?.prefix){
      alert("接頭辞は必須です。")
      return
    } 
    const res = await apiClient.master.itemType._id(0).post({body:{body:newItemTypes}})
    window.location.reload()
  },[newItemTypes])

  const handleModifyPrefix = useCallback(async (id:number, newPrefix:string) => {
    await apiClient.master.itemType._id(id).patch({body: {id, body: { prefix: newPrefix }}})
  },[itemTypes])

  const handleModifyOrder = useCallback(async (id:number, newOrder:number) => {
    await apiClient.master.itemType._id(id).patch({body: {id, body: { order: newOrder }}})
  },[itemTypes])

  return (
    <>
    <Container
      mt="50px"
      border="solid 1px #eee"
    >
    <Text fontSize="12px" textAlign="right" color="gray.500" mt="10px">※並び順と接頭辞の変更は即時保存されます</Text>
    <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>名称</Th>
            <Th w="20%">接頭辞</Th>
            <Th w="20%">並び順</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            itemTypes.map(master => (
              <Tr key={master.id}>
                <Td>
                  <Text ml="10px">
                    {master.id}
                  </Text>
                </Td>
                <Td>
                  {master.name}
                </Td>
                <Td>
                  <Input 
                  bgColor="white"
                  onChange={(e) => {
                    e.preventDefault()
                    handleModifyPrefix(master.id, e.currentTarget.value)
                  }}
                  defaultValue={master.prefix}
                  ></Input>
                </Td>
                <Td>
                  <Input 
                  width="70%"
                  bgColor="white"
                  type="number"
                  onChange={(e) => {
                    e.preventDefault()
                    handleModifyOrder(master.id, Number(e.currentTarget.value))
                  }}
                  defaultValue={master.order}
                  ></Input>
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
              defaultValue={newItemTypes?.id}
              ></Input>
            </Td>
            <Td>
            <Input 
              bgColor="white"
              type="text"
              defaultValue={newItemTypes?.name}
              onChange={(e)=>{
                  setNewItemTypes({...newItemTypes!, name: e.currentTarget.value})
              }}
              ></Input>
            </Td>
            <Td>
            <Input 
              bgColor="white"
              onChange={(e)=>
              {
                setNewItemTypes({...newItemTypes!, prefix: e.currentTarget.value})
              }}
              defaultValue={newItemTypes?.prefix}
                ></Input>
            </Td>
            <Td>
              <Flex >
                <Input 
                bgColor="white"
                type="number"
                onChange={(e)=>
                {
                  setNewItemTypes({...newItemTypes!, order: Number(e.currentTarget.value)})
                }}
                defaultValue={newItemTypes?.order}
                ></Input>
                <Button
                  bgColor="green.100"
                  onClick={(e)=>{
                    e.preventDefault()
                    handleSubmit()
                  }}
                >登録</Button>
              </Flex>
            </Td>
          </Tr>  
        </Tbody>
      </Table>
      </Container>
    </>
  )
}
export default ItemTypesManage


