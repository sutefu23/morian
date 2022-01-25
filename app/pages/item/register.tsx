import { HStack, Box, VStack, InputGroup, InputLeftAddon, Input, Spacer, Button, } from "@chakra-ui/react"
import {Form, Formik } from "formik"
import { WoodSpeciesSelect, ItemTypeSelect, SupplierSelect, GradeSelect, UnitSelect, WarehouseSelect } from "~/components/select/"
import Footer from "~/components/Footer"
import StatusBar from "~/components/feedback/statusBar"
import usePageTitle from '~/hooks/usePageTitle'
import useUser from "~/hooks/useUser"
import { InputLabel } from "@material-ui/core"
import { useCallback, useState } from "react"
import { UpdateItemData } from "~/server/domain/service/stock"
import { Decimal } from "decimal.js"
import { toNarrowCase } from "~/utils/string"

const Register = () => {
  const { setTitle } = usePageTitle()
  setTitle("新規在庫登録")
  const { user } = useUser()

  const [ stockData, setStockData ] = useState<Partial<UpdateItemData>>()

  const updateValue = useCallback(<K extends keyof UpdateItemData>(key: K, val: UpdateItemData[K]) :void => {
      setStockData({...stockData, ...{[key]:val}})
  }
  ,[stockData])

  const setLength = useCallback((length: string | number) :void => {
    switch (typeof length) {
      case "number":
        updateValue<"length">("length", length)        
        break;
      case "string":
        if(length === "乱尺")
        updateValue<"length">("length", length)        
        break;  
      default:
        alert("長さは常に「乱尺」か数字だけを許容します")
        break;
    }
  }
  ,[stockData])

  if(user && user.id !== 1){
    return <StatusBar status="error" message="登録権限のあるユーザーではありません"/>
  } 
  
   return (
    <>
    <Formik
      initialValues={{}}
      onSubmit={(values, actions) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2))
          actions.setSubmitting(false)
        }, 1000)
      }}
    >
    <Form>
    <VStack align="left" pl="10">
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>ロットNo</InputLeftAddon>
            <Input required={true} 
              onChange={(e) => { updateValue<"lotNo">("lotNo", toNarrowCase(e.target.value))}}
              value={stockData?.lotNo}
            />
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>樹種</InputLeftAddon>
            <WoodSpeciesSelect required={true} onSelect={(e) => { updateValue<"woodSpeciesId">("woodSpeciesId", Number(e.target.value))}}
              selected={stockData?.woodSpeciesId}
            />
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>材種</InputLeftAddon>
            <ItemTypeSelect required={true} 
            onSelect={(e) => { updateValue<"itemTypeId">("itemTypeId", Number(e.target.value))}}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>仕入先</InputLeftAddon>
            <SupplierSelect onSelect={(e) => { updateValue<"supplierId">("supplierId", Number(e.target.value)) }}/>
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>グレード</InputLeftAddon>
            <GradeSelect required={true} onSelect={(e) => { updateValue<"gradeId">("gradeId", Number(e.target.value))}}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon>仕様</InputLeftAddon>
            <Input onChange={(e) => { updateValue<"spec">("spec", e.target.value)}}/>
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>長さｘ厚みｘ幅</InputLeftAddon>
            <Input 
            onChange={(e) => { setLength(e.target.value)}}/>
            <InputLabel margin="dense">ｘ</InputLabel>
            <Input type="number" onChange={(e) => { updateValue<"thickness">("thickness", Number(e.target.value))}}/>
            <InputLabel margin="dense">ｘ</InputLabel>
            <Input type="number" onChange={(e) => { updateValue<"width">("width", Number(e.target.value))}}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>入数</InputLeftAddon>
            <Input required={true} type="number" onChange={(e) => { updateValue<"packageCount">("packageCount", new Decimal(e.target.value))}}/>
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup>
          <InputLeftAddon>製造元</InputLeftAddon>
            <Input onChange={(e) => { updateValue<"manufacturer">("manufacturer", e.target.value)}}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>倉庫</InputLeftAddon>
            <WarehouseSelect required={true} onSelect={(e) => { updateValue<"warehouseId">("warehouseId", Number(e.target.value))}}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>入荷予定日(自由入力)</InputLeftAddon>
            <Input required={true} onChange={(e) => { updateValue<"arrivalExpectedDate">("arrivalExpectedDate", e.target.value)}}/>
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box width="75vw" >
          <InputGroup>
            <InputLeftAddon>備考</InputLeftAddon>
            <Input onChange={(e) => { updateValue<"note">("note", e.target.value)}}/>
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box width="75vw" >
          <InputGroup>
            <InputLeftAddon>不良品備考</InputLeftAddon>
            <Input onChange={(e) => { updateValue<"defectiveNote">("defectiveNote", e.target.value)}}/>
          </InputGroup>
        </Box>
      </HStack>
      <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon>原価単位数量</InputLeftAddon>
            <Input type="number" onChange={(e) => { updateValue<"costPackageCount">("costPackageCount", new Decimal(e.target.value))}}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>原価</InputLeftAddon>
            <Input required={true} type="number" onChange={(e) => { updateValue<"cost">("cost", new Decimal(e.target.value))}}/>
            <UnitSelect required={true} onSelect={(e) => { updateValue<"costUnitId">("costUnitId", Number(e.target.value)) }}/>
          </InputGroup>
        </Box>
      </HStack>
      <Spacer />
    </VStack>

    <Footer>
    <HStack>
        <Box>
          <InputGroup>
            <InputLeftAddon>最小単位当たりの原価</InputLeftAddon>
            <Input type="number" onChange={(e) => { return }}/>
          </InputGroup>
        </Box>
        <Box>
          <InputGroup>
            <InputLeftAddon aria-required>在庫金額</InputLeftAddon>
            <Input type="number" onChange={(e) => { return}}/>
            <UnitSelect onSelect={(e) => { return }}/>
          </InputGroup>
        </Box>
        <Box>
          <Button type='submit' ml={50} w={100} bgColor="green.200">登録</Button>
        </Box>
      </HStack>
    </Footer>
    </Form>
    </Formik>
    </>
  )
}

export default Register