import { HStack, Box, VStack, InputGroup, InputLeftAddon, Input, Spacer, Button,FormLabel } from "@chakra-ui/react"
import { WoodSpeciesSelect, ItemTypeSelect, SupplierSelect, GradeSelect, UnitSelect, WarehouseSelect } from "~/components/select/"
import Footer from "~/components/Footer"
import useStock from "~/hooks/useStock"
import { Decimal } from "decimal.js"
import usePageTitle from '~/hooks/usePageTitle'
import "~/utils/string"
import "~/utils/number"
import dayjs from "dayjs"
import { useAspidaQuery } from '@aspida/react-query'
import { apiClient } from "~/utils/apiClient"

type Props = {
  isFromIssue?: boolean //発注情報を入庫化する時
  onSuccess: () => void
}

const Register = ({isFromIssue, onSuccess = () => {window.location.reload}}:Props) => {
  const { setTitle } = usePageTitle()
  if(!isFromIssue){
    setTitle("新規在庫登録")
  }
  const {data:itemTypes} = useAspidaQuery(apiClient.master.itemType)
    
  const { stockData, setStockData, updateField, calcCostPackageCount, costPerUnit, totalPrice, postStock } = useStock()
  return (
    <>
    <form
    >
    <VStack align="left" pl="10">
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required
            bgColor={isFromIssue?"red.100":undefined}
            >ロットNo</InputLeftAddon>
            <Input required
              placeholder="半角英数字のみ可"
              onChange={(e) => {
                const lotNo = e.target.value.toNarrowCase()
                const prefix = lotNo.charAt(0)
                const itemType = itemTypes?.find(itm => itm.prefix === prefix)
                setStockData({...stockData, lotNo, itemTypeId:itemType?.id, itemTypeName: itemType?.name})                
              }}
              value={stockData?.lotNo}
            />
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>樹種</InputLeftAddon>
            <WoodSpeciesSelect required
              onSelect={(e) => {
                const {options, selectedIndex} = e.target
                setStockData({...stockData, woodSpeciesId : Number(e.target.value), woodSpeciesName: options[selectedIndex].innerHTML})
              }}
              value={stockData?.woodSpeciesId}
            />
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>材種</InputLeftAddon>
            <ItemTypeSelect required 
            value={stockData?.itemTypeId}
            onSelect={(select) => {
              setStockData({ ...stockData, itemTypeId : select?.id, itemTypeName: select?.name, lotNo:`${select?.prefix}-`})
            }}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>仕入先</InputLeftAddon>
            <SupplierSelect 
              onSelect={ (selected) => {
                setStockData({...stockData, supplierId: selected.id, supplierName: selected.name})}}
              defaultKey={stockData.supplierId}
            />
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>グレード</InputLeftAddon>
            <GradeSelect value={stockData.gradeId} onSelect={(e) => { 
              const {options, selectedIndex} = e.target
              setStockData({ ...stockData, gradeId : Number(e.target.value), gradeName: options[selectedIndex].innerHTML})
            }}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon>仕様</InputLeftAddon>
            <Input placeholder="自由入力" defaultValue={stockData.spec}
            onBlur={(e) => { updateField<"spec">("spec", e.target.value)}}/>
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>長さｘ厚みｘ幅</InputLeftAddon>
            <Input placeholder="長さ" defaultValue={stockData.length} onBlur={(e) => { updateField<"length">("length", e.target.value as number | "乱尺")}}/>
            <FormLabel style={{fontSize:"1.2em", marginTop:"5px"}}>ｘ</FormLabel>
            <Input placeholder="厚み" type="number" defaultValue={stockData.thickness} onBlur={(e) => { updateField<"thickness">("thickness", Number(e.target.value))}}/>
            <FormLabel style={{fontSize:"1.2em", marginTop:"5px"}}>ｘ</FormLabel>
            <Input placeholder="幅" type="number" defaultValue={stockData.width} onBlur={(e) => { updateField<"width">("width", Number(e.target.value))}}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>入数</InputLeftAddon>
            <Input required type="number" 
            defaultValue={stockData.packageCount ? Number(stockData.packageCount): undefined}
            placeholder="数字" 
            onBlur={(e) => {
              updateField<"packageCount">("packageCount", e.target.value ? new Decimal(e.target.value): undefined)}}/>
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup>
          <InputLeftAddon>製造元</InputLeftAddon>
            <Input placeholder="自由入力" defaultValue={stockData.manufacturer} onBlur={(e) => { updateField<"manufacturer">("manufacturer", e.target.value)}}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required bgColor={isFromIssue?"red.100":undefined}>倉庫</InputLeftAddon>
            <WarehouseSelect required 
            value={stockData?.warehouseId}
            onSelect={(e) => { 
              const {options, selectedIndex} = e.target
              setStockData({ ...stockData, warehouseId : Number(e.target.value), warehouseName: options[selectedIndex].innerHTML})
              }}/>
          </InputGroup>
        </Box>
        <Box>
        <InputGroup>
          <InputLeftAddon aria-required bgColor={isFromIssue?"red.100":undefined}>入荷日</InputLeftAddon>
          <Input type="date" 
          required
          value={stockData.arrivalDate ? dayjs(stockData.arrivalDate).format('YYYY-MM-DD'): undefined}
          onChange={(e) => { 
            updateField<"arrivalDate">("arrivalDate", e.target.valueAsDate ?? undefined)}}/>
        </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>原価</InputLeftAddon>
            <Input required type="number" 
            defaultValue={stockData.cost ? Number(stockData.cost): undefined}
            placeholder="数字"
            onBlur={(e) => { updateField<"cost">("cost", e.target.value ? new Decimal(e.target.value): undefined)}}/>
            <FormLabel fontSize="1.2em" mt="5px">/</FormLabel>
            <UnitSelect required 
            value={stockData.costUnitId}
            onSelect={(e) => { 
              const {options, selectedIndex} = e.target
              setStockData({ ...stockData, costUnitId : Number(e.target.value), costUnitName: options[selectedIndex].innerHTML})
              }}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>数量</InputLeftAddon>
            <Input required 
            defaultValue={stockData.count ? Number(stockData.count): undefined}
            type="number" placeholder="数字" 
            onBlur={(e) => { updateField<"count">("count", e.target.value ? new Decimal(e.target.value): undefined)}}/>
            <UnitSelect required 
            value={stockData.unitId}
            onSelect={(e) => { 
              const {options, selectedIndex} = e.target
              setStockData({ ...stockData, unitId : Number(e.target.value), unitName: options[selectedIndex].innerHTML})
            }}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>原価単位数量</InputLeftAddon>
            <Input required placeholder="原価算出基準となる数量" step="0.001" type="number" defaultValue={stockData.costPackageCount ? Number(stockData.costPackageCount): undefined}
            onBlur={(e) => { updateField<"costPackageCount">("costPackageCount", e.target.value ? new Decimal(e.target.value): undefined)}}/>
            <Button onClick={() => {
              const computedValue = calcCostPackageCount()
              if(computedValue){
                updateField<"costPackageCount">("costPackageCount",computedValue)
              }
            }
            }>計算</Button>
          </InputGroup>
        </Box>
      </HStack>
        <Spacer/>
      <HStack>
        <Box width="75vw" >
          <InputGroup>
            <InputLeftAddon>備考</InputLeftAddon>
            <Input onChange={(e) => { updateField<"note">("note", e.target.value)}}/>
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box width="75vw" >
          <InputGroup>
            <InputLeftAddon>不良品備考</InputLeftAddon>
            <Input placeholder="割れなど傷品としての備考" onChange={(e) => { updateField<"defectiveNote">("defectiveNote", e.target.value)}}/>
          </InputGroup>
        </Box>
      </HStack>
    </VStack>

    <Footer>
    <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon>最小単位当たりの原価</InputLeftAddon>
            <Input textAlign="right" readOnly value={costPerUnit().toYenFormatKanji() }/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>在庫金額</InputLeftAddon>
            <Input textAlign="right" readOnly value={totalPrice().toYenFormatKanji()}/>
          </InputGroup>
        </Box>
        <Box>
          <Button type='submit' ml={50} w={100} bgColor="green.200"
          onClick={async (e) => {
            e.preventDefault()
            try{
              await postStock()
              onSuccess()
              if(!isFromIssue){
                window.location.reload()
              }
            }catch(e){
              console.error(e)
            }
            }
          }
          >登録</Button>
        </Box>
        {/* <Box>
          <Button ml={50} w={100} bgColor="red.200"
            onClick={useDemo}
          >デモ</Button>
        </Box> */}
      </HStack>
    </Footer>
    </form>
    </>
  )
}
  
export default Register