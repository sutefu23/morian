import { HStack, Box, VStack, InputGroup, InputLeftAddon, Divider, InputRightAddon, Input, Button } from "@chakra-ui/react"
import { WoodSpeciesSelect, ItemTypeSelect, SupplierSelect, GradeSelect, UnitSelect, DeliveryPlaceSelect } from "~/components/select/"
import Footer from "~/components/Footer"
import { InputLabel } from "@material-ui/core"
import useIssue, { defaultData } from "~/hooks/useIssue"
import { Decimal } from "decimal.js"
import usePageTitle from '~/hooks/usePageTitle'
import "~/utils/string"
import "~/utils/number"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import dayjs from 'dayjs'
import useUser from "~/hooks/useUser"
import { useAspidaQuery } from "@aspida/react-query"
import { apiClient } from "~/utils/apiClient"

const RegisterIssue = () => {
 
  const { 
    issueData,
    setIssueData,
    updateField,
    addItemData,
    deleteItemData,
    updateItemField,
    calcCostPackageCount,
    costPerUnit,
    totalPrice,
    postIssue,
    updateIssue,
    fetchOrderSheet } = useIssue()

    const router = useRouter();
    
    const {data:editIssues, status} = useAspidaQuery(apiClient.issue,{query:{id: Number(router.query["issueId"])}})
    const [isEdit, setIsEdit] = useState<boolean>(false) 

    const { setTitle } = usePageTitle()
    setTitle(`在庫発注 ${isEdit?"編集":"新規作成"}`)

    useEffect(()=>{
      if(status==="success" && editIssues && editIssues.length > 0){
        setIssueData(editIssues[0])
        setIsEdit(true)
      }else{
        setIssueData(defaultData)  
        setIsEdit(false)
      }
    },[status, editIssues])
    
    useEffect(()=>{
      if(editIssues && editIssues.length > 0){
        setIssueData(editIssues[0])  
      }  
    },[])

    const { user } = useUser()
    useEffect(() => {
      if(user){
        setIssueData({...issueData, ...{userId: user.id, userName: user.name}})
      }
    },[user])

    const pageChangeHandler = () => {
      if(!isEdit && issueData?.issueItems?.length && issueData?.issueItems[0].itemTypeId){
        const answer = window.confirm('内容がリセットされます、本当にページ遷移しますか？');
        if(!answer) {
          // eslint-disable-next-line no-throw-literal
          throw 'Abort route change. Please ignore this error.'
        }  
      }
    };
    
    useEffect(() => {
      router.events.on('routeChangeStart', pageChangeHandler);
      return () => {
        router.events.off('routeChangeStart', pageChangeHandler)
      };
    }, []);

  return (
    <>
    <form
    >
    <VStack align="left" pl="10" mb="4">
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon bgColor="blue.100" aria-required>管理番号</InputLeftAddon>
            <Input required
              readOnly={isEdit}
              placeholder="半角英数字のみ可"
              onChange={(e) => { updateField<"managedId">("managedId", e.target.value.toNarrowCase())}}
              value={issueData?.managedId}
            />
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon bgColor="blue.100" aria-required>発注日</InputLeftAddon>
            <Input required
              type="date"
              readOnly={isEdit}
              placeholder="半角英数字のみ可"
              onChange={(e) => { 
                updateField<"date">("date", new Date(e.target.value))
              }}
              value={issueData.date ? dayjs(issueData.date as Date).format('YYYY-MM-DD'): undefined}
            />
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon bgColor="blue.100" aria-required>仕入先</InputLeftAddon>
            <SupplierSelect  
              readOnly={isEdit}
              onSelect={
                (selected) => {
                  setIssueData({...issueData, supplierId: selected.id, supplierName: selected.name})}
              }
              defaultKey={issueData.supplierId}  
            />
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon bgColor="blue.100">先方担当者</InputLeftAddon>
            <Input placeholder="自由入力" onChange={(e) => { updateField<"supplierManagerName">("supplierManagerName", e.target.value)}}/>
            <InputRightAddon>様</InputRightAddon>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon bgColor="blue.100">希望納期</InputLeftAddon>
            <Input 
              onChange={(e) => { updateField<"expectDeliveryDate">("expectDeliveryDate", e.target.value)}}
              value={issueData.expectDeliveryDate}
            />
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon bgColor="blue.100" aria-required>納入場所</InputLeftAddon>
            <DeliveryPlaceSelect required onSelect={(e) => { 
              if(issueData.issueItems){
                const {options, selectedIndex} = e.target
                setIssueData({...issueData, ...{ deliveryPlaceId : Number(e.target.value), deliveryPlaceName: options[selectedIndex].innerHTML}})  
              }
            }}
              value={issueData.deliveryPlaceId}
            />
          </InputGroup>
        </Box>
        <Box w="40vw">
          <InputGroup>
            <InputLeftAddon bgColor="blue.100">納入住所</InputLeftAddon>
            <Input onChange={(e) => { updateField<"deliveryAddress">("deliveryAddress", e.target.value)}}
            value={issueData.deliveryAddress}
            />
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon bgColor="blue.100">受取担当</InputLeftAddon>
            <Input 
              onChange={(e) => { updateField<"receiveingStaff">("receiveingStaff", e.target.value)}}
              value={issueData.receiveingStaff}
            />
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box width="75vw" >
          <InputGroup>
            <InputLeftAddon bgColor="blue.100">発注書備考</InputLeftAddon>
            <Input onChange={(e) => { updateField<"issueNote">("issueNote", e.target.value)}}
            value={issueData.issueNote}
            />
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box width="75vw" >
          <InputGroup>
            <InputLeftAddon bgColor="blue.300">内部備考</InputLeftAddon>
            <Input onChange={(e) => { updateField<"innerNote">("innerNote", e.target.value)}}
            value={issueData.innerNote}
            />
          </InputGroup>
        </Box>
      </HStack>
    </VStack>
    <Divider mb="4"/>
      {
        issueData.issueItems &&
        issueData.issueItems.map((item, index) => (
          <VStack align="left" pl="10" mb="10" key={index}>
            <HStack>
              <Box>
                <InputGroup>
                  <InputLeftAddon aria-required>樹種</InputLeftAddon>
                  <WoodSpeciesSelect required
                    readOnly={isEdit}
                    onSelect={(e) => {
                    if(issueData.issueItems){
                      const {options, selectedIndex} = e.target
                      const newItem = { ...issueData.issueItems[index], ...{ woodSpeciesId : Number(e.target.value), woodSpeciesName: options[selectedIndex].innerHTML}}
                      const newItems = Object.assign([], issueData.issueItems, {[index]: newItem})
                      setIssueData({...issueData, ...{ issueItems: newItems}})  
                    }
                  }}
                    value={item.woodSpeciesId??undefined}
                  />
                </InputGroup>
              </Box>
              <Box>
                <InputGroup>
                  <InputLeftAddon aria-required>材種</InputLeftAddon>
                  <ItemTypeSelect required 
                  value={item.itemTypeId}
                  readOnly={isEdit}
                  onSelect={(e) => { 
                    if(issueData.issueItems){
                      const {options, selectedIndex} = e.target
                      const newItem = { ...issueData.issueItems[index], ...{ itemTypeId : Number(e.target.value), itemTypeName: options[selectedIndex].innerHTML}}
                      const newItems = Object.assign([], issueData.issueItems, {[index]: newItem})
                      setIssueData({...issueData, ...{ issueItems: newItems}})  
                    }
                  }}/>
                </InputGroup>
              </Box>
              <Box>
                <Button 
                bgColor="red.100"
                ml="10"
                visibility={!isEdit?"visible":"hidden"}
                onClick={() => {
                  if(confirm("こちらの明細を削除しますか？")){
                    deleteItemData(index)
                  }
                }
                }
                >行削除</Button>
              </Box>
            </HStack>
            <HStack>
              <Box>
                <InputGroup>
                  <InputLeftAddon aria-required>グレード</InputLeftAddon>
                  <GradeSelect value={item.gradeId ?? undefined} onSelect={(e) => { 
                    if(issueData.issueItems){
                      const {options, selectedIndex} = e.target
                      const newItem = { ...issueData.issueItems[index], ...{ gradeId : Number(e.target.value), gradeName: options[selectedIndex].innerHTML}}
                      const newItems = Object.assign([], issueData.issueItems, {[index]: newItem})
                      setIssueData({...issueData, ...{ issueItems: newItems}})  
                    }
                    }}/>
                </InputGroup>
              </Box>
              <Box>
                <InputGroup>
                  <InputLeftAddon>仕様</InputLeftAddon>
                  <Input placeholder="自由入力" onChange={(e) => { updateItemField<"spec">(index, "spec", e.target.value)}}/>
                </InputGroup>
              </Box>
              <Box>
                <InputGroup>
                  <InputLeftAddon>製造元</InputLeftAddon>
                  <Input placeholder="自由入力" onChange={(e) => { updateItemField<"manufacturer">(index, "manufacturer", e.target.value)}}/>
                </InputGroup>
              </Box>
            </HStack>
            <HStack>
              <Box>
                <InputGroup>
                  <InputLeftAddon aria-required>長さｘ厚みｘ幅</InputLeftAddon>
                  <Input placeholder="長さ" value={item.length ?? undefined} onChange={(e) => { updateItemField<"length">(index, "length", e.target.value)}}/>
                  <InputLabel style={{fontSize:"1.2em", marginTop:"10px"}}>ｘ</InputLabel>
                  <Input placeholder="厚み" type="number" value={item.thickness?? undefined} onChange={(e) => { updateItemField<"thickness">(index, "thickness", (e.target.value)?Number(e.target.value):undefined)}}/>
                  <InputLabel style={{fontSize:"1.2em", marginTop:"10px"}}>ｘ</InputLabel>
                  <Input placeholder="幅" type="number" value={item.width ?? undefined} onChange={(e) => { updateItemField<"width">(index, "width", (e.target.value)?Number(e.target.value):undefined)}}/>
                </InputGroup>
              </Box>
              <Box>
                <InputGroup>
                  <InputLeftAddon aria-required>入数</InputLeftAddon>
                  <Input required type="number" 
                  value={String(item.packageCount)}
                  placeholder="数字" onChange={(e) => {
                    updateItemField<"packageCount">(index, "packageCount", e.target.value ? new Decimal(e.target.value): undefined)}}/>
                </InputGroup>
              </Box>
            </HStack>
            <HStack>
              <Box>
                <InputGroup>
                  <InputLeftAddon aria-required>原価</InputLeftAddon>
                  <Input required type="number" 
                  value={String(item.cost)}
                  placeholder="数字" onChange={(e) => { updateItemField<"cost">(index, "cost", e.target.value ? new Decimal(e.target.value): undefined)}}/>
                  <InputLabel style={{fontSize:"1.5em", marginTop:"10px"}}>/</InputLabel>
                  <UnitSelect required 
                  value={item.costUnitId}
                  onSelect={(e) => { 
                    if(issueData.issueItems){
                      const {options, selectedIndex} = e.target
                      const newItem = { ...issueData.issueItems[index], ...{ costUnitId : Number(e.target.value), costUnitName: options[selectedIndex].innerHTML}}
                      const newItems = Object.assign([], issueData.issueItems, {[index]: newItem})
                      setIssueData({...issueData, ...{ issueItems: newItems}})  
                    }
                    }}/>
                </InputGroup>
              </Box>
              <Box>
                <InputGroup>
                  <InputLeftAddon aria-required>数量</InputLeftAddon>
                  <Input required 
                  value={String(item.count)}
                  type="number" placeholder="数字" onChange={(e) => { updateItemField<"count">(index, "count", e.target.value ? new Decimal(e.target.value): undefined)}}/>
                  <UnitSelect required 
                  value={item.unitId}
                  onSelect={(e) => { 
                    if(issueData.issueItems){
                      const {options, selectedIndex} = e.target
                      const newItem = { ...issueData.issueItems[index], ...{ unitId : Number(e.target.value), unitName: options[selectedIndex].innerHTML}}
                      const newItems = Object.assign([], issueData.issueItems, {[index]: newItem})
                      setIssueData({...issueData, ...{ issueItems: newItems}})  
                    }
                    }}/>
                </InputGroup>
              </Box>
              <Box>
                <InputGroup>
                  <InputLeftAddon aria-required>原価単位数量</InputLeftAddon>
                  <Input required placeholder="原価算出基準となる数量" step="0.001" value={String(item.costPackageCount ? item.costPackageCount : '')} onChange={(e) => { updateItemField<"costPackageCount">(index, "costPackageCount", e.target.value ? new Decimal(e.target.value): undefined)}}/>
                  <Button onClick={() => {
                    const computedValue = calcCostPackageCount(item)
                    if(computedValue){
                      updateItemField<"costPackageCount">(index, "costPackageCount",computedValue)
                    }
                  }
                  }>計算</Button>
                </InputGroup>
              </Box>
            </HStack>
            <HStack justifyContent="center">
            <Box>
            <InputGroup>
              <InputLeftAddon>最小単位当たりの原価</InputLeftAddon>
              <Input textAlign="right" readOnly value={
                costPerUnit(item).toYenFormatKanji()
                }/>
            </InputGroup>
          </Box>
          <Box>
            <InputGroup>
              <InputLeftAddon aria-required>在庫金額</InputLeftAddon>
              <Input textAlign="right" readOnly value={
                totalPrice(item).toYenFormatKanji()
                }/>
            </InputGroup>
          </Box>
            </HStack>

          </VStack>
        ))
      }
      <Box textAlign="left">
      <Button ml="50" w={80} bgColor="green.100"
        visibility={!isEdit?"visible":"hidden"}
        onClick={() => addItemData()}
        >行追加</Button>
      </Box>      

    <Footer>
    <HStack>
        <Box>
          {
            isEdit?
            <Button type='submit' ml={50} w={100} bgColor="green.400"
            onClick={async (e) => {
              e.preventDefault()
              await updateIssue()
              router.push("/")
              }
            }
            >更新</Button>
            :
            <Button type='submit' ml={50} w={100} bgColor="green.400"
            onClick={async (e) => {
              e.preventDefault()
              await postIssue()
              }
            }
            >登録</Button>
          }
        </Box>
        <Box>
            <Button ml={50} w={100} bgColor="blue.200"
              onClick={fetchOrderSheet}
            >発注書</Button>
        </Box>
      </HStack>
    </Footer>
    </form>
    </>
  )
}

export default RegisterIssue