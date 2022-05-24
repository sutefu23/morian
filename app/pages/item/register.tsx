import { HStack, Box, VStack, InputGroup, InputLeftAddon, Input, Spacer, Button, } from "@chakra-ui/react"
import { WoodSpeciesSelect, ItemTypeSelect, SupplierSelect, GradeSelect, UnitSelect, WarehouseSelect } from "~/components/select/"
import Footer from "~/components/Footer"
import { InputLabel } from "@material-ui/core"
import useStock from "~/hooks/useStock"
import { Decimal } from "decimal.js"
import usePageTitle from '~/hooks/usePageTitle'
import "~/utils/string"
import "~/utils/number"
import dayjs from "dayjs"

type Props = {
  isFromIssue?: boolean //発注情報を入庫化する時
  onSuccess: () => void
}

const Register = ({isFromIssue, onSuccess = () => {window.location.reload}}:Props) => {
  const { setTitle } = usePageTitle()
  if(!isFromIssue){
    setTitle("新規在庫登録")
  }
  
  const { stockData, setStockData, updateField, calcCostPackageCount, costPerUnit, totalPrice, postStock, useDemo } = useStock()

  return (
    <>
    <form
    >
    <VStack align="left" pl="10">
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>ロットNo</InputLeftAddon>
            <Input required
              placeholder="半角英数字のみ可"
              onChange={(e) => { updateField<"lotNo">("lotNo", e.target.value.toNarrowCase())}}
              value={stockData?.lotNo}
            />
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>樹種</InputLeftAddon>
            <WoodSpeciesSelect required onSelect={(e) => { updateField<"woodSpeciesId">("woodSpeciesId", Number(e.target.value))}}
              value={stockData?.woodSpeciesId}
            />
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>材種</InputLeftAddon>
            <ItemTypeSelect required 
            value={stockData?.itemTypeId}
            onSelect={(e) => { updateField<"itemTypeId">("itemTypeId", Number(e.target.value))}}/>
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
            <GradeSelect value={stockData.gradeId} onSelect={(e) => { updateField<"gradeId">("gradeId", Number(e.target.value))}}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon>仕様</InputLeftAddon>
            <Input placeholder="自由入力" value={stockData.spec} onChange={(e) => { updateField<"spec">("spec", e.target.value)}}/>
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>長さｘ厚みｘ幅</InputLeftAddon>
            <Input placeholder="長さ" value={stockData.length} onChange={(e) => { updateField<"length">("length", e.target.value as number | "乱尺")}}/>
            <InputLabel style={{fontSize:"1.2em", marginTop:"10px"}}>ｘ</InputLabel>
            <Input placeholder="厚み" type="number" value={stockData.thickness} onChange={(e) => { updateField<"thickness">("thickness", Number(e.target.value))}}/>
            <InputLabel style={{fontSize:"1.2em", marginTop:"10px"}}>ｘ</InputLabel>
            <Input placeholder="幅" type="number" value={stockData.width} onChange={(e) => { updateField<"width">("width", Number(e.target.value))}}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>入数</InputLeftAddon>
            <Input required type="number" 
            value={stockData.packageCount?.toString()}
            placeholder="数字" onChange={(e) => {
              updateField<"packageCount">("packageCount", e.target.value ? new Decimal(e.target.value): undefined)}}/>
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup>
          <InputLeftAddon>製造元</InputLeftAddon>
            <Input placeholder="自由入力" value={stockData.manufacturer} onChange={(e) => { updateField<"manufacturer">("manufacturer", e.target.value)}}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required bgColor={isFromIssue?"red.100":undefined}>倉庫</InputLeftAddon>
            <WarehouseSelect required 
            value={stockData?.warehouseId}
            onSelect={(e) => { updateField<"warehouseId">("warehouseId", Number(e.target.value))}}/>
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
            value={stockData.cost?.toString()}
            placeholder="数字" onChange={(e) => { updateField<"cost">("cost", e.target.value ? new Decimal(e.target.value): undefined)}}/>
            <InputLabel style={{fontSize:"1.5em", marginTop:"10px"}}>/</InputLabel>
            <UnitSelect required 
            value={stockData.costUnitId}
            onSelect={(e) => { updateField<"costUnitId">("costUnitId", Number(e.target.value)) }}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>数量</InputLeftAddon>
            <Input required 
            value={stockData.count?.toString()}
            type="number" placeholder="数字" onChange={(e) => { updateField<"count">("count", e.target.value ? new Decimal(e.target.value): undefined)}}/>
            <UnitSelect required 
            value={stockData.unitId}
            onSelect={(e) => { updateField<"unitId">("unitId", Number(e.target.value)) }}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>原価単位数量</InputLeftAddon>
            <Input required placeholder="原価算出基準となる数量" step="0.001" value={stockData.costPackageCount?.toString()} onChange={(e) => { updateField<"costPackageCount">("costPackageCount", e.target.value ? new Decimal(e.target.value): undefined)}}/>
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
            }catch(e){
              console.error(e)
            }
            }
          }
          >登録</Button>
        </Box>
        <Box>
          <Button ml={50} w={100} bgColor="red.200"
            onClick={useDemo}
          >デモ</Button>
        </Box>
      </HStack>
    </Footer>
    </form>
    </>
  )
}
  
export default Register