import { HStack, Box, VStack, InputGroup, InputLeftAddon, Input, Spacer, Button, } from "@chakra-ui/react"
import { WoodSpeciesSelect, ItemTypeSelect, SupplierSelect, GradeSelect, UnitSelect, WarehouseSelect } from "~/components/select/"
import Footer from "~/components/Footer"
import StatusBar from "~/components/feedback/statusBar"
import usePageTitle from '~/hooks/usePageTitle'
import useUser from "~/hooks/useUser"
import { InputLabel } from "@material-ui/core"
import useStock from "~/hooks/useStock"
import { Decimal } from "decimal.js"
import "~/utils/string"
import "~/utils/number"

const Register = () => {
  const { setTitle } = usePageTitle()
  setTitle("新規在庫登録")
  const { user } = useUser()

  const { stockData, updateField, calcCostPackageCount, costPerUnit, totalPrice, postStock, useDemo } = useStock()



  if(user && user.id !== 1){
    return <StatusBar status="error" message="登録権限のあるユーザーではありません"/>
  } 
  
   return (
    <>
    <form>
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
            <SupplierSelect onSelect={ (key) => {updateField<"supplierId">("supplierId", Number(key))}}/>
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>グレード</InputLeftAddon>
            <GradeSelect required value={stockData.gradeId} onSelect={(e) => { updateField<"gradeId">("gradeId", Number(e.target.value))}}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon>仕様</InputLeftAddon>
            <Input placeholder="自由入力" onChange={(e) => { updateField<"spec">("spec", e.target.value)}}/>
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
              updateField<"packageCount">("packageCount", new Decimal(e.target.value))}}/>
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
            <InputLeftAddon aria-required>倉庫</InputLeftAddon>
            <WarehouseSelect required 
            value={stockData?.warehouseId}
            onSelect={(e) => { updateField<"warehouseId">("warehouseId", Number(e.target.value))}}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>入荷予定日</InputLeftAddon>
            <Input placeholder="自由入力" required 
            value={stockData.arrivalExpectedDate}
            onChange={(e) => { updateField<"arrivalExpectedDate">("arrivalExpectedDate", e.target.value)}}/>
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>原価</InputLeftAddon>
            <Input required type="number" 
            value={stockData.cost?.toString()}
            placeholder="数字" onChange={(e) => { updateField<"cost">("cost", new Decimal(e.target.value))}}/>
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
            type="number" placeholder="数字" onChange={(e) => { updateField<"count">("count", new Decimal(e.target.value))}}/>
            <UnitSelect required 
            value={stockData.unitId}
            onSelect={(e) => { updateField<"unitId">("unitId", Number(e.target.value)) }}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>原価単位数量</InputLeftAddon>
            <Input required placeholder="原価算出基準となる数量" value={stockData.costPackageCount?.toString()} onChange={(e) => { updateField<"costPackageCount">("costPackageCount", new Decimal(e.target.value))}}/>
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
            <Input align="right" readOnly value={costPerUnit().toYenFormatKanji() }/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>在庫金額</InputLeftAddon>
            <Input align="right" readOnly value={totalPrice().toYenFormatKanji()}/>
          </InputGroup>
        </Box>
        <Box>
          <Button type='submit' ml={50} w={100} bgColor="green.200"
            onClick={async (e) => {
              e.preventDefault()
              await postStock()
            }}
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