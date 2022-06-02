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
import { DeliveryPlaceType } from "~/server/domain/entity/stock"
import { apiClient } from "~/utils/apiClient"

const DeliveryPlaceTypeManage = () => {
  const { setTitle } = usePageTitle()
  const [masters, setDeliveryPlaceTypes ] = useState<DeliveryPlaceType[]>([])
  const [newDeliveryPlaceType, setNewDeliveryPlaceType] = useState<DeliveryPlaceType>()
  setTitle(`配送場所 マスタ設定`)

  useAspidaQuery(apiClient.master.deliveryPlace,{onSuccess:async (masters) => {
    const maxId = masters.reduce((prevId, curr)=>(
      prevId < curr.id ? curr.id : prevId
    ), 0)

    const maxOrder = masters.reduce((prevOrder, curr)=>(
      prevOrder < curr.order ? curr.order : prevOrder 
    ), 0)
     
    setNewDeliveryPlaceType({
      id:maxId + 1,
      name: newDeliveryPlaceType?.name || "",
      order: maxOrder + 1,
      address:newDeliveryPlaceType?.address || "",
    })
    const data = await apiClient.master.deliveryPlace.get()
    const body = data.body
    setDeliveryPlaceTypes(body)
  }})


  const handleSubmit = useCallback(async ()=>{
    if(!newDeliveryPlaceType ) return
    if(!newDeliveryPlaceType?.name || newDeliveryPlaceType.name.length === 0){
      alert("名称は必須です。")
      return
    } 
    if(!newDeliveryPlaceType?.order || !isFinite(newDeliveryPlaceType.order)){
      alert("並び順は必須です。")
      return
    } 

    await apiClient.master.deliveryPlace._id(0).post({body:{body:newDeliveryPlaceType}})
    window.location.reload()
  },[newDeliveryPlaceType])

  const handleModifyAddress = useCallback(async (id:number, newAddhandleModifyAddress:string) => {
    await apiClient.master.deliveryPlace._id(id).patch({body: {id, body: { address: newAddhandleModifyAddress }}})
  },[masters])

  const handleModifyOrder = useCallback(async (id:number, newOrder:number) => {
    await apiClient.master.deliveryPlace._id(id).patch({body: {id, body: { order: newOrder }}})
  },[masters])

  return (
    <>
    <Container
      mt="50px"
      border="solid 1px #eee"
      w="80vw"
      maxW="80vw"
    >
    <Table variant="striped" colorScheme="gray" w="100%">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>名称</Th>
            <Th>住所</Th>
            <Th>並び順</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            masters.map(master => (
              <Tr key={master.id}>
                <Td width="20%">
                  <Text ml="10px">
                    {master.id}
                  </Text>
                </Td>
                <Td width="20%">
                  {master.name}
                </Td>
                <Td>
                  <Input 
                  bgColor="white"
                  type="text"
                  onChange={(e) => {
                    e.preventDefault()
                    handleModifyAddress(master.id, e.currentTarget.value)
                  }}
                  defaultValue={master.address}
                  ></Input>
                </Td>
                <Td width="20%">
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
              defaultValue={newDeliveryPlaceType?.id}
              ></Input>
            </Td>
            <Td>
            <Input 
              bgColor="white"
              type="text"
              defaultValue={newDeliveryPlaceType?.name}
              onChange={(e)=>{
                  setNewDeliveryPlaceType({...newDeliveryPlaceType!, name: e.currentTarget.value})
              }}
              ></Input>
            </Td>
            <Td>
            <Input 
              bgColor="white"
              type="text"
              defaultValue={newDeliveryPlaceType?.address}
              onChange={(e)=>{
                  setNewDeliveryPlaceType({...newDeliveryPlaceType!, address: e.currentTarget.value})
              }}
              ></Input>
            </Td>
            <Td>
              <Flex >
                <Input 
                bgColor="white"
                type="number"
                onClick={(e)=>
                {
                  setNewDeliveryPlaceType({...newDeliveryPlaceType!, order: Number(e.currentTarget.value)})
                }}
                defaultValue={newDeliveryPlaceType?.order}
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
export default DeliveryPlaceTypeManage


