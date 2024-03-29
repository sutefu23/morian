import { HStack, Box, VStack, InputGroup, InputLeftAddon, Divider, InputRightAddon, Input, Button, FormLabel, useDisclosure } from '@chakra-ui/react'
import { WoodSpeciesSelect, ItemTypeSelect, SupplierSelect, GradeSelect, UnitSelect, DeliveryPlaceSelect, UserSelect } from '~/components/select/'
import Footer from '~/components/Footer'
import TemplateModal from './templateModal'
import useIssue from '~/hooks/useIssue'
import { Decimal } from 'decimal.js'
import usePageTitle from '~/hooks/usePageTitle'
import '~/utils/string'
import '~/utils/number'
import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import { useAspidaQuery } from '@aspida/react-query'
import { apiClient } from '~/utils/apiClient'
import useUser from '~/hooks/useUser'

const RegisterIssue = () => {
  const { issueData, setIssueData, issueSaveData, editMode, setEditMode, pushTemplate, updateField, addItemData, deleteItemData, copyItemLine, updateItemField, calcCostPackageCount, costPerUnit, totalPrice, postIssue, downloadOrderSheet, templates, removeTemplates, updateIssue } = useIssue()

  const router = useRouter()
  const { data: editIssues, status } = useAspidaQuery(apiClient.issue, {
    query: { id: Number(router.query['issueId']) },
    enabled: Boolean(router.query['issueId'])
  })

  const { setTitle } = usePageTitle()

  //初回レンダリング時データリストア
  useEffect(() => {
    // 編集モード
    if (Boolean(router.query['issueId']) && status === 'success' && editIssues && editIssues.length > 0) {
      setEditMode('update')
      setIssueData(editIssues[0])
    } else {
      // 新規作成モード
      setEditMode('create')
      if (router.query['defaultData']) {
        //値の指定がある（コピー作成時など）
        const issueData = JSON.parse(router.query['defaultData'] as string)
        setIssueData(issueData)
      } else {
        setIssueData(issueSaveData) //自動保存データのリストア
      }
    }
    setTitle(`在庫発注 ${editMode == 'create' ? '新規作成' : '編集'}`)
  }, [setTitle])

  const { user } = useUser()
  useEffect(() => {
    if (user && !issueData.userId) {
      setIssueData({
        ...issueData,
        ...{ userId: user.id, userName: user.name }
      })
    }
  }, [user, issueData, setIssueData])

  const { isOpen: isTemplateOpen, onClose: onTemplateClose, onOpen: onTemplateOpen } = useDisclosure()

  const handlePushTemplate = useCallback(() => {
    const key = prompt('テンプレート保存名を入力してください')
    if (key) {
      pushTemplate({ key, data: issueData })
      alert('保存しました。')
    }
  }, [issueData, pushTemplate])

  return (
    <>
      <form>
        <VStack align="left" pl="10" mb="4">
          <HStack>
            <Box>
              <InputGroup>
                <InputLeftAddon bgColor="blue.100" aria-required>
                  管理番号
                </InputLeftAddon>
                <Input
                  readOnly={editMode === 'update'}
                  disabled
                  type="text"
                  placeholder="自動採番"
                  onChange={(e) => {
                    updateField<'managedId'>('managedId', e.target.value.toNarrowCase())
                  }}
                  value={issueData.managedId}
                />
              </InputGroup>
            </Box>
            <Box>
              <InputGroup>
                <InputLeftAddon bgColor="blue.100" aria-required>
                  発注日
                </InputLeftAddon>
                <Input
                  required
                  type="date"
                  readOnly={editMode === 'update'}
                  placeholder="半角英数字のみ可"
                  onChange={(e) => {
                    updateField<'date'>('date', new Date(e.target.value))
                  }}
                  value={issueData.date ? dayjs(issueData.date as Date).format('YYYY-MM-DD') : ''}
                />
              </InputGroup>
            </Box>
            <Box>
              <InputGroup>
                <InputLeftAddon aria-required bgColor="green.100">
                  発注者
                </InputLeftAddon>
                <UserSelect
                  required
                  value={issueData.userId ?? undefined}
                  onSelect={(e) => {
                    updateField<'userId'>('userId', Number(e.currentTarget.value))
                  }}
                />
              </InputGroup>
            </Box>
          </HStack>
          <HStack>
            <Box>
              <InputGroup>
                <InputLeftAddon bgColor="blue.100" aria-required>
                  仕入先
                </InputLeftAddon>
                <SupplierSelect
                  readOnly={editMode === 'update'}
                  onSelect={(selected) => {
                    setIssueData({
                      ...issueData,
                      supplierId: selected.id,
                      supplierName: selected.name
                    })
                  }}
                  defaultKey={issueData.supplierId}
                />
              </InputGroup>
            </Box>
            <Box>
              <InputGroup>
                <InputLeftAddon bgColor="blue.100">先方担当者</InputLeftAddon>
                <Input
                  placeholder="自由入力"
                  onBlur={(e) => {
                    updateField<'supplierManagerName'>('supplierManagerName', e.target.value)
                  }}
                  defaultValue={issueData.supplierManagerName}
                />
                <InputRightAddon>様</InputRightAddon>
              </InputGroup>
            </Box>
            <Box>
              <InputGroup>
                <InputLeftAddon bgColor="blue.100">希望納期</InputLeftAddon>
                <Input
                  onBlur={(e) => {
                    updateField<'expectDeliveryDate'>('expectDeliveryDate', e.target.value)
                  }}
                  defaultValue={issueData.expectDeliveryDate}
                />
              </InputGroup>
            </Box>
          </HStack>
          <HStack>
            <Box>
              <InputGroup>
                <InputLeftAddon bgColor="blue.100" aria-required>
                  納入場所
                </InputLeftAddon>
                <DeliveryPlaceSelect
                  required
                  onSelect={(selected) => {
                    if (issueData.issueItems) {
                      setIssueData({
                        ...issueData,
                        deliveryPlaceId: selected.id,
                        deliveryPlaceName: selected.name,
                        deliveryAddress: selected.address
                      })
                    }
                  }}
                  value={issueData.deliveryPlaceId}
                />
              </InputGroup>
            </Box>
            <Box w="40vw">
              <InputGroup>
                <InputLeftAddon bgColor="blue.100">納入住所</InputLeftAddon>
                <Input
                  onBlur={(e) => {
                    updateField<'deliveryAddress'>('deliveryAddress', e.target.value)
                  }}
                  defaultValue={issueData.deliveryAddress}
                />
              </InputGroup>
            </Box>
            <Box>
              <InputGroup>
                <InputLeftAddon bgColor="blue.100">受取担当</InputLeftAddon>
                <Input
                  onBlur={(e) => {
                    updateField<'receiveingStaff'>('receiveingStaff', e.target.value)
                  }}
                  defaultValue={issueData.receiveingStaff}
                />
              </InputGroup>
            </Box>
          </HStack>
          <HStack>
            <Box width="75vw">
              <InputGroup>
                <InputLeftAddon bgColor="blue.100">発注書備考</InputLeftAddon>
                <Input
                  onBlur={(e) => {
                    updateField<'issueNote'>('issueNote', e.target.value)
                  }}
                  defaultValue={issueData.issueNote}
                />
              </InputGroup>
            </Box>
          </HStack>
          <HStack>
            <Box width="75vw">
              <InputGroup>
                <InputLeftAddon bgColor="blue.300">内部備考</InputLeftAddon>
                <Input
                  onBlur={(e) => {
                    updateField<'innerNote'>('innerNote', e.target.value)
                  }}
                  defaultValue={issueData.innerNote}
                />
              </InputGroup>
            </Box>
          </HStack>
        </VStack>
        <Divider mb="4" />
        {issueData.issueItems &&
          issueData.issueItems.map((item, index) => (
            <VStack align="left" pl="10" mb="10" key={index}>
              <HStack>
                <Box>
                  <InputGroup>
                    <InputLeftAddon aria-required>樹種</InputLeftAddon>
                    <WoodSpeciesSelect
                      required
                      readOnly={editMode === 'update'}
                      onSelect={(e) => {
                        if (issueData.issueItems) {
                          const { options, selectedIndex } = e.target
                          const newItem = {
                            ...issueData.issueItems[index],
                            ...{
                              woodSpeciesId: e.target.value ? Number(e.target.value) : undefined,
                              woodSpeciesName: options[selectedIndex].innerHTML
                            }
                          }
                          const newItems = Object.assign([], issueData.issueItems, { [index]: newItem })
                          setIssueData({
                            ...issueData,
                            ...{ issueItems: newItems }
                          })
                        }
                      }}
                      value={item.woodSpeciesId ?? undefined}
                    />
                  </InputGroup>
                </Box>
                <Box>
                  <InputGroup>
                    <InputLeftAddon aria-required>分類</InputLeftAddon>
                    <ItemTypeSelect
                      required
                      value={item.itemTypeId}
                      readOnly={editMode === 'update'}
                      onSelect={(select) => {
                        if (issueData.issueItems) {
                          const newItem = {
                            ...issueData.issueItems[index],
                            ...{
                              itemTypeId: select?.id,
                              itemTypeName: select?.name
                            }
                          }
                          const newItems = Object.assign([], issueData.issueItems, { [index]: newItem })
                          setIssueData({
                            ...issueData,
                            ...{ issueItems: newItems }
                          })
                        }
                      }}
                    />
                  </InputGroup>
                </Box>
                <Box>
                  <Button
                    bgColor="red.100"
                    ml="10"
                    visibility={editMode !== 'update' ? 'visible' : 'hidden'}
                    onClick={() => {
                      if (confirm('こちらの明細を削除しますか？')) {
                        deleteItemData(index)
                      }
                    }}
                  >
                    行削除
                  </Button>
                </Box>
                <Box>
                  <Button
                    bgColor="yellow.100"
                    ml="10"
                    visibility={editMode !== 'update' ? 'visible' : 'hidden'}
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
                      value={item.gradeId ?? undefined}
                      onSelect={(e) => {
                        if (issueData.issueItems) {
                          const { options, selectedIndex } = e.target
                          const newItem = {
                            ...issueData.issueItems[index],
                            ...{
                              gradeId: e.target.value ? Number(e.target.value) : undefined,
                              gradeName: options[selectedIndex].innerHTML
                            }
                          }
                          const newItems = Object.assign([], issueData.issueItems, { [index]: newItem })
                          setIssueData({
                            ...issueData,
                            ...{ issueItems: newItems }
                          })
                        }
                      }}
                    />
                  </InputGroup>
                </Box>
                <Box>
                  <InputGroup>
                    <InputLeftAddon>仕様</InputLeftAddon>
                    <Input
                      placeholder="自由入力"
                      defaultValue={item.spec ?? ''}
                      onBlur={(e) => {
                        updateItemField<'spec'>(index, 'spec', e.target.value)
                      }}
                    />
                  </InputGroup>
                </Box>
                <Box>
                  <InputGroup>
                    <InputLeftAddon>製造元</InputLeftAddon>
                    <Input
                      placeholder="自由入力"
                      defaultValue={item.manufacturer ?? ''}
                      onBlur={(e) => {
                        updateItemField<'manufacturer'>(index, 'manufacturer', e.target.value)
                      }}
                    />
                  </InputGroup>
                </Box>
              </HStack>
              <HStack>
                <Box>
                  <InputGroup>
                    <InputLeftAddon aria-required>長さｘ厚みｘ幅</InputLeftAddon>
                    <Input
                      placeholder="長さ"
                      defaultValue={item.length ?? undefined}
                      onBlur={(e) => {
                        updateItemField<'length'>(index, 'length', e.target.value)
                      }}
                    />
                    <FormLabel style={{ fontSize: '1.2em', marginTop: '5px' }}>ｘ</FormLabel>
                    <Input
                      placeholder="厚み"
                      type="number"
                      defaultValue={item.thickness ?? undefined}
                      onBlur={(e) => {
                        updateItemField<'thickness'>(index, 'thickness', e.target.value ? Number(e.target.value) : undefined)
                      }}
                    />
                    <FormLabel style={{ fontSize: '1.2em', marginTop: '5px' }}>ｘ</FormLabel>
                    <Input
                      placeholder="幅"
                      type="number"
                      defaultValue={item.width ?? undefined}
                      onBlur={(e) => {
                        updateItemField<'width'>(index, 'width', e.target.value ? Number(e.target.value) : undefined)
                      }}
                    />
                  </InputGroup>
                </Box>
                <Box>
                  <InputGroup>
                    <InputLeftAddon aria-required>入数</InputLeftAddon>
                    <Input
                      required
                      type="number"
                      defaultValue={item.cost ? Number(item.packageCount) : undefined}
                      placeholder="数字"
                      onBlur={(e) => {
                        updateItemField<'packageCount'>(index, 'packageCount', e.target.value ? new Decimal(e.target.value) : undefined)
                      }}
                    />
                  </InputGroup>
                </Box>
              </HStack>
              <HStack>
                <Box>
                  <InputGroup>
                    <InputLeftAddon aria-required>原価</InputLeftAddon>
                    <Input
                      required
                      type="number"
                      defaultValue={item.cost ? Number(item.cost) : undefined}
                      placeholder="数字"
                      onBlur={(e) => {
                        updateItemField<'cost'>(index, 'cost', e.target.value ? new Decimal(e.target.value) : undefined)
                      }}
                    />
                    <FormLabel fontSize="1.2em" mt="5px">
                      /
                    </FormLabel>
                    <UnitSelect
                      required
                      value={item.costUnitId}
                      onSelect={(e) => {
                        if (issueData.issueItems) {
                          const { options, selectedIndex } = e.target
                          const newItem = {
                            ...issueData.issueItems[index],
                            ...{
                              costUnitId: e.target.value ? Number(e.target.value) : undefined,
                              costUnitName: options[selectedIndex].innerHTML
                            }
                          }
                          const newItems = Object.assign([], issueData.issueItems, { [index]: newItem })
                          setIssueData({
                            ...issueData,
                            ...{ issueItems: newItems }
                          })
                        }
                      }}
                    />
                  </InputGroup>
                </Box>
                <Box>
                  <InputGroup>
                    <InputLeftAddon aria-required>数量</InputLeftAddon>
                    <Input
                      required
                      defaultValue={item.cost ? Number(item.count) : undefined}
                      type="number"
                      placeholder="数字"
                      onBlur={(e) => {
                        updateItemField<'count'>(index, 'count', e.target.value ? new Decimal(e.target.value) : undefined)
                      }}
                    />
                    <UnitSelect
                      required
                      value={item.unitId}
                      onSelect={(e) => {
                        if (issueData.issueItems) {
                          const { options, selectedIndex } = e.target
                          const newItem = {
                            ...issueData.issueItems[index],
                            ...{
                              unitId: e.target.value ? Number(e.target.value) : undefined,
                              unitName: options[selectedIndex].innerHTML
                            }
                          }
                          const newItems = Object.assign([], issueData.issueItems, { [index]: newItem })
                          setIssueData({
                            ...issueData,
                            ...{ issueItems: newItems }
                          })
                        }
                      }}
                    />
                  </InputGroup>
                </Box>
                <Box>
                  <InputGroup>
                    <InputLeftAddon aria-required>原価単位数量</InputLeftAddon>
                    <Input
                      required
                      placeholder="原価算出基準となる数量"
                      step="0.001"
                      type="number"
                      defaultValue={String(item.costPackageCount ? item.costPackageCount : '')}
                      onBlur={(e) => {
                        updateItemField<'costPackageCount'>(index, 'costPackageCount', e.target.value ? new Decimal(e.target.value) : undefined)
                      }}
                    />
                    <Button
                      onClick={() => {
                        const computedValue = calcCostPackageCount(item)
                        if (computedValue) {
                          updateItemField<'costPackageCount'>(index, 'costPackageCount', computedValue)
                        }
                      }}
                    >
                      計算
                    </Button>
                  </InputGroup>
                </Box>
              </HStack>
              <HStack justifyContent="center">
                <Box>
                  <InputGroup>
                    <InputLeftAddon>最小単位当たりの原価</InputLeftAddon>
                    <Input textAlign="right" readOnly value={costPerUnit(item).toYenFormatKanji()} />
                  </InputGroup>
                </Box>
                <Box>
                  <InputGroup>
                    <InputLeftAddon aria-required>在庫金額</InputLeftAddon>
                    <Input textAlign="right" readOnly value={totalPrice(item).toYenFormatKanji()} />
                  </InputGroup>
                </Box>
              </HStack>
            </VStack>
          ))}
        <Box textAlign="left">
          <Button ml="50" w={80} bgColor="green.100" visibility={editMode !== 'update' ? 'visible' : 'hidden'} onClick={() => addItemData()}>
            行追加
          </Button>
        </Box>

        <Footer>
          <HStack>
            <Box>
              {editMode === 'update' ? (
                <Button
                  type="submit"
                  ml={50}
                  w={100}
                  bgColor="green.400"
                  onClick={async (e) => {
                    e.preventDefault()
                    await updateIssue()
                    router.push('/')
                  }}
                >
                  更新
                </Button>
              ) : (
                <Button
                  type="submit"
                  ml={50}
                  w={100}
                  bgColor="green.400"
                  onClick={async (e) => {
                    e.preventDefault()
                    try {
                      const ret = await postIssue()
                      if (ret?.id) {
                        router.push({
                          pathname: `/issue/issue/`,
                          query: { issueId: ret.id }
                        })
                      }
                    } catch (e) {
                      console.error(e)
                    }
                  }}
                >
                  登録
                </Button>
              )}
            </Box>
            <Box>
              <Button
                ml={50}
                w={100}
                bgColor="blue.200"
                disabled={Boolean(!issueData.id)}
                onClick={(e) => {
                  e.preventDefault()
                  downloadOrderSheet()
                }}
              >
                発注書
              </Button>
            </Box>
            {editMode === 'update' ? (
              <Box>
                <Button
                  type="submit"
                  ml={50}
                  w={100}
                  bgColor="blue.400"
                  onClick={(e) => {
                    e.preventDefault()
                    router.push('/issue/issue/')
                  }}
                >
                  新規作成
                </Button>
              </Box>
            ) : (
              <Box pl={100}>
                <Button
                  type="submit"
                  ml={50}
                  bgColor="green.100"
                  onClick={(e) => {
                    e.preventDefault()
                    handlePushTemplate()
                  }}
                >
                  テンプレート保存
                </Button>
                <Button
                  type="submit"
                  ml={50}
                  bgColor="blue.100"
                  onClick={(e) => {
                    e.preventDefault()
                    onTemplateOpen()
                  }}
                >
                  テンプレート一覧
                </Button>
              </Box>
            )}
          </HStack>
          <TemplateModal
            templates={templates}
            onDecide={(template) => {
              setIssueData(template.data)
            }}
            onRemove={(index) => {
              removeTemplates(index)
            }}
            isOpen={isTemplateOpen}
            onClose={onTemplateClose}
          />
        </Footer>
      </form>
    </>
  )
}

export default RegisterIssue
