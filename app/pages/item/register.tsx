import {
  HStack,
  Box,
  VStack,
  InputGroup,
  InputLeftAddon,
  Input,
  Spacer,
  Button,
  Divider,
  FormLabel
} from '@chakra-ui/react'
import {
  WoodSpeciesSelect,
  ItemTypeSelect,
  SupplierSelect,
  GradeSelect,
  UnitSelect,
  WarehouseSelect
} from '~/components/select/'
import Footer from '~/components/Footer'
import useStock from '~/hooks/useStock'
import { Decimal } from 'decimal.js'
import type { Decimal as ServerDecimal } from 'server/node_modules/decimal.js'
import usePageTitle from '~/hooks/usePageTitle'
import '~/utils/string'
import '~/utils/number'
import dayjs from 'dayjs'

type Props = {
  isFromIssue?: boolean //発注情報を入庫化する時
  onSuccess: () => void
}

const Register = ({
  isFromIssue,
  onSuccess = () => {
    window.location.reload
  }
}: Props) => {
  const { setTitle } = usePageTitle()
  if (!isFromIssue) {
    setTitle('新規在庫登録')
  }

  const {
    headerData,
    stockItems,
    updateItem,
    updateHeader,
    updateItemField,
    addItemLine,
    deleteItemLine,
    copyItemLine,
    postStock,
    resetData
  } = useStock()
  return (
    <>
      <VStack align="left" pl="10" mb="3">
        <HStack>
          <Box>
            <InputGroup>
              <InputLeftAddon aria-required bgColor="blue.100">
                仕入先
              </InputLeftAddon>
              <SupplierSelect
                onSelect={(selected) => {
                  updateHeader({
                    supplierId: selected.id,
                    supplierName: selected.name
                  })
                }}
                defaultKey={headerData.supplierId}
              />
            </InputGroup>
          </Box>
          <Box>
            <InputGroup>
              <InputLeftAddon bgColor="blue.100">仕入先担当者</InputLeftAddon>
              <Input
                placeholder="担当者"
                defaultValue={headerData.supplierManagerName}
                onBlur={(e) => {
                  updateHeader({
                    supplierManagerName: e.target.value
                  })
                }}
              />
            </InputGroup>
          </Box>
        </HStack>
      </VStack>
      <Divider mb="4" />
      {stockItems &&
        stockItems?.map((item, index) => (
          <>
            <VStack key={index} align="left" pl="10">
              <HStack>
                <Box>
                  <InputGroup>
                    <InputLeftAddon aria-required>樹種</InputLeftAddon>
                    <WoodSpeciesSelect
                      required
                      onSelect={(e) => {
                        const { options, selectedIndex } = e.target
                        updateItem(index, {
                          woodSpeciesId: Number(e.target.value),
                          woodSpeciesName: options[selectedIndex].innerHTML
                        })
                      }}
                      value={item?.woodSpeciesId}
                    />
                  </InputGroup>
                </Box>
                <Box>
                  <InputGroup>
                    <InputLeftAddon aria-required>分類</InputLeftAddon>
                    <ItemTypeSelect
                      required
                      value={item?.itemTypeId}
                      onSelect={(select) => {
                        updateItem(index, {
                          itemTypeId: select?.id,
                          itemTypeName: select?.name
                        })
                      }}
                    />
                  </InputGroup>
                </Box>
                <Box>
                  <Button
                    bgColor="red.100"
                    ml="10"
                    onClick={() => {
                      if (confirm('こちらの明細を削除しますか？')) {
                        deleteItemLine(index)
                      }
                    }}
                  >
                    行削除
                  </Button>
                </Box>
                <Box>
                  <Button
                    bgColor="yellow.100"
                    ml="5"
                    onClick={() => {
                      copyItemLine(index)
                    }}
                  >
                    行コピー
                  </Button>
                </Box>
              </HStack>

              <HStack>
                <Box>
                  <InputGroup>
                    <InputLeftAddon aria-required>グレード</InputLeftAddon>
                    <GradeSelect
                      value={item.gradeId}
                      onSelect={(e) => {
                        const { options, selectedIndex } = e.target
                        updateItem(index, {
                          gradeId: Number(e.target.value),
                          gradeName: options[selectedIndex].innerHTML
                        })
                      }}
                    />
                  </InputGroup>
                </Box>
                <Box>
                  <InputGroup>
                    <InputLeftAddon>仕様</InputLeftAddon>
                    <Input
                      placeholder="塗装/無塗装等"
                      value={item.spec}
                      onBlur={(e) => {
                        updateItemField<'spec'>(index, 'spec', e.target.value)
                      }}
                    />
                  </InputGroup>
                </Box>
                <Box>
                  <InputGroup>
                    <InputLeftAddon
                      aria-required
                      bgColor={isFromIssue ? 'red.100' : undefined}
                    >
                      ロットNo
                    </InputLeftAddon>
                    <Input
                      required
                      readOnly={true}
                      type="text"
                      placeholder="自動取得"
                      onChange={(e) => {
                        const lotNo = e.target.value.toNarrowCase()
                        updateItem(index, {
                          lotNo: lotNo
                        })
                      }}
                      value={item?.lotNo}
                    />
                  </InputGroup>
                </Box>
              </HStack>
              <HStack>
                <Box>
                  <InputGroup>
                    <InputLeftAddon>長さｘ厚みｘ幅</InputLeftAddon>
                    <Input
                      placeholder="長さ"
                      value={item.length}
                      type="text"
                      onBlur={(e) => {
                        updateItemField<'length'>(
                          index,
                          'length',
                          e.target.value
                        )
                      }}
                    />
                    <FormLabel style={{ fontSize: '1.2em', marginTop: '5px' }}>
                      ｘ
                    </FormLabel>
                    <Input
                      placeholder="厚み"
                      type="number"
                      value={item.thickness}
                      onChange={(e) => {
                        updateItemField<'thickness'>(
                          index,
                          'thickness',
                          Number(e.target.value)
                        )
                      }}
                    />
                    <FormLabel style={{ fontSize: '1.2em', marginTop: '5px' }}>
                      ｘ
                    </FormLabel>
                    <Input
                      placeholder="幅"
                      type="number"
                      value={item.width}
                      onChange={(e) => {
                        updateItemField<'width'>(
                          index,
                          'width',
                          Number(e.target.value)
                        )
                      }}
                    />
                  </InputGroup>
                </Box>
                <Box>
                  <InputGroup>
                    <InputLeftAddon>入数</InputLeftAddon>
                    <Input
                      required
                      type="number"
                      value={
                        item.packageCount
                          ? Number(item.packageCount)
                          : undefined
                      }
                      placeholder="数字"
                      onChange={(e) => {
                        updateItemField<'packageCount'>(
                          index,
                          'packageCount',
                          e.target.value
                            ? (new Decimal(
                                e.target.value
                              ) as unknown as ServerDecimal)
                            : undefined
                        )
                      }}
                    />
                    <UnitSelect
                      required
                      value={item.packageCountUnitId}
                      onSelect={(e) => {
                        const { options, selectedIndex } = e.target
                        updateItem(index, {
                          packageCountUnitId: Number(e.target.value),
                          packageCountUnitName: options[selectedIndex].innerHTML
                        })
                      }}
                    />
                  </InputGroup>
                </Box>
              </HStack>
              <HStack>
                <Box>
                  <InputGroup>
                    <InputLeftAddon>製造元</InputLeftAddon>
                    <Input
                      placeholder="自由入力"
                      defaultValue={item.manufacturer}
                      onBlur={(e) => {
                        updateItemField<'manufacturer'>(
                          index,
                          'manufacturer',
                          e.target.value
                        )
                      }}
                    />
                  </InputGroup>
                </Box>
                <Box>
                  <InputGroup>
                    <InputLeftAddon
                      aria-required
                      bgColor={isFromIssue ? 'red.100' : undefined}
                    >
                      倉庫
                    </InputLeftAddon>
                    <WarehouseSelect
                      required
                      value={item?.warehouseId}
                      onSelect={(e) => {
                        const { options, selectedIndex } = e.target
                        updateItem(index, {
                          warehouseId: Number(e.target.value),
                          warehouseName: options[selectedIndex].innerHTML
                        })
                      }}
                    />
                  </InputGroup>
                </Box>
                <Box>
                  <InputGroup>
                    <InputLeftAddon
                      aria-required
                      bgColor={isFromIssue ? 'red.100' : undefined}
                    >
                      入荷日
                    </InputLeftAddon>
                    <Input
                      type="date"
                      value={
                        item.arrivalDate
                          ? dayjs(item.arrivalDate).format('YYYY-MM-DD')
                          : undefined
                      }
                      onChange={(e) => {
                        updateItemField<'arrivalDate'>(
                          index,
                          'arrivalDate',
                          e.target.valueAsDate ?? undefined
                        )
                      }}
                    />
                  </InputGroup>
                </Box>
              </HStack>
              <HStack>
                <Box>
                  <InputGroup>
                    <InputLeftAddon>原価</InputLeftAddon>
                    <Input
                      required
                      type="number"
                      value={item.cost ? Number(item.cost) : undefined}
                      placeholder="数字"
                      onChange={(e) => {
                        updateItemField<'cost'>(
                          index,
                          'cost',
                          e.target.value
                            ? (new Decimal(
                                e.target.value
                              ) as unknown as ServerDecimal)
                            : undefined
                        )
                      }}
                    />
                    <FormLabel fontSize="1.2em" mt="5px">
                      /
                    </FormLabel>
                    <UnitSelect
                      required
                      value={item.costUnitId}
                      onSelect={(e) => {
                        const { options, selectedIndex } = e.target
                        updateItem(index, {
                          costUnitId: Number(e.target.value),
                          costUnitName: options[selectedIndex].innerHTML
                        })
                      }}
                    />
                  </InputGroup>
                </Box>
                <Box>
                  <InputGroup>
                    <InputLeftAddon aria-required>数量</InputLeftAddon>
                    <Input
                      required
                      value={item.count ? Number(item.count) : undefined}
                      type="number"
                      placeholder="数字"
                      onChange={(e) => {
                        updateItemField<'count'>(
                          index,
                          'count',
                          e.target.value
                            ? (new Decimal(
                                e.target.value
                              ) as unknown as ServerDecimal)
                            : undefined
                        )
                      }}
                    />
                    <UnitSelect
                      required
                      value={item.unitId}
                      onSelect={(e) => {
                        const { options, selectedIndex } = e.target
                        updateItem(index, {
                          unitId: Number(e.target.value),
                          unitName: options[selectedIndex].innerHTML
                        })
                      }}
                    />
                  </InputGroup>
                </Box>
              </HStack>
              <Spacer />
              <HStack>
                <Box width="75vw">
                  <InputGroup>
                    <InputLeftAddon>備考</InputLeftAddon>
                    <Input
                      defaultValue={item.note}
                      onBlur={(e) => {
                        updateItemField<'note'>(index, 'note', e.target.value)
                      }}
                    />
                  </InputGroup>
                </Box>
              </HStack>
              <HStack>
                <Box width="75vw">
                  <InputGroup>
                    <InputLeftAddon>不良品備考</InputLeftAddon>
                    <Input
                      placeholder="割れなど傷品としての備考"
                      defaultValue={item.defectiveNote}
                      onBlur={(e) => {
                        updateItemField<'defectiveNote'>(
                          index,
                          'defectiveNote',
                          e.target.value
                        )
                      }}
                    />
                  </InputGroup>
                </Box>
              </HStack>
            </VStack>
            <Divider mt="4" mb="4" />
          </>
        ))}

      <Footer>
        <HStack>
          <Box>
            <Button
              type="submit"
              ml={50}
              w={100}
              bgColor="green.200"
              onClick={async (e) => {
                e.preventDefault()
                try {
                  await postStock()
                  onSuccess()
                } catch (e) {
                  console.error(e)
                }
              }}
            >
              登録
            </Button>
          </Box>
          <Box textAlign="left">
            <Button
              ml="50"
              w={80}
              bgColor="green.100"
              onClick={() => addItemLine()}
            >
              行追加
            </Button>
            <Button
              type="submit"
              ml={50}
              w={100}
              bgColor="pink.200"
              onClick={(e) => {
                e.preventDefault()
                const res = confirm('データをリセットします。')
                if (res) {
                  resetData()
                }
              }}
            >
              リセット
            </Button>
          </Box>
        </HStack>
      </Footer>
    </>
  )
}

export default Register
