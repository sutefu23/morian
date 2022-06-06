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
import { Master } from "~/server/domain/entity/stock"
import { apiClient } from "~/utils/apiClient"
import { useRouter } from "next/router"
export type MasterName = '単位'|'材種'|'樹種'|'倉庫'|'配送場所'|'グレード'
export type MasterKey = 'unit'|'itemType'|'species'|'warehouse'|'grade'
export type MasterTypes = readonly {key:MasterKey, name:MasterName}[]

export const masterTypes:MasterTypes = [
  {key:'itemType',name:"材種"},
  {key:'species',name:"樹種"},
  {key:'grade',name:"グレード"},
  {key:'warehouse',name:"倉庫"},
  {key:'unit',name:"単位"},
] as const

const MasterManage = () => {
  const { setTitle } = usePageTitle()
  const [masters, setMasters ] = useState<Master[]>([])
  const [newMaster, setNewMaster] = useState<Master>()
  const router = useRouter()
  const { masterType } = router.query
  if(!masterType ){
    return <>Loading..</>
  }
  useAspidaQuery(apiClient.master[masterType as unknown as MasterKey],{onSuccess: async (masters) => {

    const maxId = masters.reduce((prevId, curr)=>(
      prevId < curr.id ? curr.id : prevId
    ), 0)

    const maxOrder = masters.reduce((prevOrder, curr)=>(
      prevOrder < curr.order ? curr.order : prevOrder 
    ), 0)
     
    setNewMaster({
      id:maxId + 1,
      name: newMaster?.name || "",
      order: maxOrder + 1
    })
    setMasters(masters)
    const title = masterTypes.find(m => m.key === masterType)?.name
    setTitle(`${title} マスタ設定`)
  }})

  const handleSubmit = useCallback(async ()=>{
    if(!newMaster ) return
    if(!newMaster?.name || newMaster.name.length === 0){
      alert("名称は必須です。")
      return
    } 
    if(!newMaster?.order || !isFinite(newMaster.order)){
      alert("並び順は必須です。")
      return
    } 

    const type = masterType as unknown as MasterKey
    const res = await apiClient.master[type]._id(0).post({body:{body:newMaster}})
    window.location.reload()
  },[newMaster])

  const handleModifyOrder = useCallback(async (id:number, newOrder:number) => {
    const type = masterType as unknown as MasterKey
    await apiClient.master[type]._id(id).patch({body: {id, body: { order: newOrder }}})
  },[masters])

  return (
    <>
    <Container
      mt="50px"
      border="solid 1px #eee"
    >
    <Text fontSize="12px" textAlign="right" color="gray.500" mt="10px">※並び順の変更は即時保存されます</Text>
    <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>名称</Th>
            <Th>並び順</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            masters.map(master => (
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
              defaultValue={newMaster?.id}
              ></Input>
            </Td>
            <Td>
            <Input 
              bgColor="white"
              type="text"
              defaultValue={newMaster?.name}
              onChange={(e)=>{
                  setNewMaster({...newMaster!, name: e.currentTarget.value})
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
                  setNewMaster({...newMaster!, order: Number(e.currentTarget.value)})
                }}
                defaultValue={newMaster?.order}
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
export default MasterManage


