import { useAspidaQuery } from '@aspida/react-query'
import { Table, Thead, Tbody, Tr, Th, Td, Text, Input, Container, Button } from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import usePageTitle from '~/hooks/usePageTitle'
import { SupplierDTO } from '~/server/domain/dto/supplier'
import { apiClient } from '~/utils/apiClient'
import { produce } from 'immer'
import { useEffect } from 'react'
const SupplierManage = () => {
  const { setTitle } = usePageTitle()
  const [suppliers, setSuppliers] = useState<SupplierDTO[]>([])
  const [newSupplier, setNewSupplier] = useState<SupplierDTO>()
  useEffect(() => {
    setTitle(`仕入先 マスタ設定`)
  }, [setTitle])
  useAspidaQuery(apiClient.supplier, {
    onSuccess: async (suppliers) => {
      const maxId = suppliers.reduce((prevId, curr) => (prevId < curr.id ? curr.id : prevId), 0)

      setNewSupplier({
        id: maxId + 1,
        name: newSupplier?.name || '',
        furigana: newSupplier?.furigana || '',
        zip: newSupplier?.zip || '',
        prefecture: newSupplier?.prefecture || '',
        address: newSupplier?.address || '',
        tel: newSupplier?.tel || '',
        fax: newSupplier?.fax || '',
        enable: true
      })
      const data = await apiClient.supplier.get()
      const body = data.body
      setSuppliers(body)
    }
  })

  const handleSubmit = useCallback(async () => {
    if (!newSupplier) return
    if (!newSupplier?.name || newSupplier.name.length === 0) {
      alert('名称は必須です。')
      return
    }

    await apiClient.supplier._id(0).post({ body: { body: newSupplier } })
    window.location.reload()
  }, [newSupplier])

  const setSupplier = useCallback(
    (index: number, key: keyof SupplierDTO, value: SupplierDTO[keyof SupplierDTO]) => {
      const supplier = { ...suppliers[index], ...{ [key]: value } }
      const newSuppliers = produce(suppliers, (drafts) => {
        drafts[index] = supplier
      })
      setSuppliers(newSuppliers)
    },
    [suppliers]
  )

  const submitModifySupplier = useCallback(
    async (index: number) => {
      const id = suppliers[index].id
      try {
        const res = await apiClient.supplier._id(id).patch({ body: { id: suppliers[index].id, body: suppliers[index] } })
        if (res.body) {
          alert('登録しました')
        }
      } catch (e) {
        alert(e)
      }
    },
    [suppliers]
  )

  return (
    <>
      <Container mt="50px" border="solid 1px #eee" w="100vw" maxW="100vw">
        <Table variant="striped" colorScheme="gray" w="100%" size="sm">
          <Thead>
            <Tr>
              <Th width="5%">ID</Th>
              <Th width="15%">名称</Th>
              <Th width="15%">フリガナ</Th>
              <Th width="8%">郵便番号</Th>
              <Th width="8%">都道府県</Th>
              <Th width="20%">住所</Th>
              <Th>電話番号</Th>
              <Th>FAX</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {suppliers.map((supplier, idx) => (
              <Tr key={supplier.id}>
                <Td>
                  <Text ml="10px">{supplier.id}</Text>
                </Td>
                <Td>
                  <Input
                    bgColor="white"
                    type="text"
                    onChange={(e) => {
                      e.preventDefault()
                      setSupplier(idx, 'name', e.target.value)
                    }}
                    defaultValue={supplier.name ?? ''}
                  ></Input>
                </Td>
                <Td>
                  <Input
                    bgColor="white"
                    type="text"
                    onChange={(e) => {
                      e.preventDefault()
                      setSupplier(idx, 'furigana', e.target.value)
                    }}
                    defaultValue={supplier.furigana ?? ''}
                  ></Input>
                </Td>
                <Td>
                  <Input
                    bgColor="white"
                    onChange={(e) => {
                      e.preventDefault()
                      setSupplier(idx, 'zip', e.target.value)
                    }}
                    defaultValue={supplier.zip ?? ''}
                  ></Input>
                </Td>

                <Td>
                  <Input
                    bgColor="white"
                    onChange={(e) => {
                      e.preventDefault()
                      setSupplier(idx, 'prefecture', e.target.value)
                    }}
                    defaultValue={supplier.prefecture ?? ''}
                  ></Input>
                </Td>
                <Td>
                  <Input
                    bgColor="white"
                    onChange={(e) => {
                      e.preventDefault()
                      setSupplier(idx, 'address', e.target.value)
                    }}
                    defaultValue={supplier.address ?? ''}
                  ></Input>
                </Td>
                <Td>
                  <Input
                    bgColor="white"
                    onChange={(e) => {
                      e.preventDefault()
                      setSupplier(idx, 'tel', e.target.value)
                    }}
                    defaultValue={supplier.tel ?? ''}
                  ></Input>
                </Td>
                <Td>
                  <Input
                    bgColor="white"
                    onChange={(e) => {
                      e.preventDefault()
                      setSupplier(idx, 'fax', e.target.value)
                    }}
                    defaultValue={supplier.fax ?? ''}
                  ></Input>
                </Td>
                <Td>
                  <Button
                    bgColor="blue.200"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      submitModifySupplier(idx)
                    }}
                  >
                    更新
                  </Button>
                </Td>
              </Tr>
            ))}
            <Tr>
              <Td>
                <Input bgColor="white" type="text" readOnly defaultValue={newSupplier?.id}></Input>
              </Td>
              <Td>
                <Input
                  bgColor="white"
                  type="text"
                  defaultValue={newSupplier?.name}
                  onChange={(e) => {
                    setNewSupplier({ ...newSupplier!, name: e.currentTarget.value })
                  }}
                  placeholder="名称"
                ></Input>
              </Td>
              <Td>
                <Input
                  bgColor="white"
                  type="text"
                  defaultValue={newSupplier?.furigana}
                  onChange={(e) => {
                    setNewSupplier({ ...newSupplier!, furigana: e.currentTarget.value })
                  }}
                  placeholder="ふりがな(全角ひらがな)"
                ></Input>
              </Td>
              <Td>
                <Input
                  bgColor="white"
                  type="text"
                  defaultValue={newSupplier?.zip ?? ''}
                  onChange={(e) => {
                    setNewSupplier({ ...newSupplier!, zip: e.currentTarget.value })
                  }}
                  placeholder="郵便番号"
                ></Input>
              </Td>
              <Td>
                <Input
                  bgColor="white"
                  type="text"
                  defaultValue={newSupplier?.prefecture ?? ''}
                  onChange={(e) => {
                    setNewSupplier({ ...newSupplier!, prefecture: e.currentTarget.value })
                  }}
                  placeholder="都道府県"
                ></Input>
              </Td>
              <Td>
                <Input
                  bgColor="white"
                  type="text"
                  defaultValue={newSupplier?.address ?? ''}
                  onChange={(e) => {
                    setNewSupplier({ ...newSupplier!, address: e.currentTarget.value })
                  }}
                  placeholder="住所"
                ></Input>
              </Td>
              <Td>
                <Input
                  bgColor="white"
                  type="text"
                  defaultValue={newSupplier?.tel ?? ''}
                  onChange={(e) => {
                    setNewSupplier({ ...newSupplier!, tel: e.currentTarget.value })
                  }}
                  placeholder="TEL"
                ></Input>
              </Td>
              <Td>
                <Input
                  bgColor="white"
                  type="text"
                  defaultValue={newSupplier?.fax ?? ''}
                  onChange={(e) => {
                    setNewSupplier({ ...newSupplier!, fax: e.currentTarget.value })
                  }}
                  placeholder="FAX"
                ></Input>
              </Td>
              <Td>
                <Button
                  bgColor="green.100"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault()
                    handleSubmit()
                  }}
                >
                  登録
                </Button>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Container>
    </>
  )
}
export default SupplierManage
