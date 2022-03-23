import { HStack, Box, VStack, InputGroup, InputLeftAddon, Divider, InputRightAddon, Input,  Select, Button } from "@chakra-ui/react"
import { WoodSpeciesSelect, ItemTypeSelect, SupplierSelect, GradeSelect, UnitSelect } from "~/components/select/"
import Footer from "~/components/Footer"
import { InputLabel } from "@material-ui/core"
import useStock from "~/hooks/useStock"
import { Decimal } from "decimal.js"
import usePageTitle from '~/hooks/usePageTitle'
import "~/utils/string"
import "~/utils/number"
import { 入庫理由 } from "~/server/domain/entity/stock"
import { useState } from "react"

const Register = () => {
  const { setTitle } = usePageTitle()
  setTitle("在庫発注")
  
  const { stockData, updateField, calcCostPackageCount, costPerUnit, totalPrice, postStock, fetchOrderSheet } = useStock()
  const [ addressDisabled, setAddressDisabled ] = useState<boolean>(false)
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
              placeholder="半角英数字のみ可"
              onChange={(e) => { updateField<"lotNo">("lotNo", e.target.value.toNarrowCase())}}
              value={stockData?.lotNo}
            />
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon bgColor="blue.100" aria-required>発注日</InputLeftAddon>
            <Input required
              type="date"
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
            <InputLeftAddon bgColor="blue.100" aria-required>仕入先</InputLeftAddon>
            <SupplierSelect  onSelect={ (key) => { updateField<"supplierId">("supplierId", Number(key))}}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon bgColor="blue.100" aria-required>先方担当者</InputLeftAddon>
            <Input placeholder="自由入力" onChange={(e) => { updateField<"spec">("spec", e.target.value)}}/>
            <InputRightAddon>様</InputRightAddon>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon bgColor="blue.100">希望納期</InputLeftAddon>
            <Input 
              onChange={(e) => { updateField<"lotNo">("lotNo", e.target.value.toNarrowCase())}}
              value={stockData?.lotNo}
            />
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon bgColor="blue.100">納入場所</InputLeftAddon>
            <Select placeholder='選択してください。' onChange={(e) => {
              setAddressDisabled(e.currentTarget.value === "住所指定")
            }}>
              <option value='モリアン引取'>モリアン引取</option>
              <option value='本社工場'>本社工場</option>
              <option value='日吉工場'>日吉工場</option>
              <option value='住所指定'>住所指定</option>
            </Select>
          </InputGroup>
        </Box>
        <Box w="40vw">
          <InputGroup>
            <InputLeftAddon bgColor="blue.100">納入住所</InputLeftAddon>
            <Input disabled={addressDisabled} onChange={(e) => { updateField<"note">("note", e.target.value)}}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon bgColor="blue.100">受取担当</InputLeftAddon>
            <Input 
              onChange={(e) => { updateField<"lotNo">("lotNo", e.target.value.toNarrowCase())}}
              value={stockData?.lotNo}
            />
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box width="75vw" >
          <InputGroup>
            <InputLeftAddon bgColor="blue.100">備考</InputLeftAddon>
            <Input onChange={(e) => { updateField<"note">("note", e.target.value)}}/>
          </InputGroup>
        </Box>
      </HStack>
    </VStack>
    <Divider mb="4"/>
    <VStack align="left" pl="10">
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
              updateField<"packageCount">("packageCount", e.target.value ? new Decimal(e.target.value): undefined)}}/>
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
            await postStock(入庫理由.仕入)
            }
          }
          >登録</Button>
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

export default Register