import { SimpleGrid, Button, Heading, Container, Input, InputGroup, InputLeftAddon, Box, HStack, VStack, useDisclosure, Text } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import useHistoryReport from '~/hooks/useHistoryReport'
import useItemReport from '~/hooks/useItemReport'
import usePageTitle from '~/hooks/usePageTitle'
import Dialog from '~/components/feedback/dialog'
import dayjs from 'dayjs'
import { ItemTypeSelect, WoodSpeciesSelect } from '~/components/select'

const Report = () => {
  const { setTitle } = usePageTitle()
  useEffect(() => {
    setTitle('帳票出力')
  }, [setTitle])

  const [selectedWoodSpeciesId, setSelectedWoodSpeciesId] = useState<number | undefined>()
  const [selectedItemTypeId, setSelectedItemTypeId] = useState<number | undefined>()
  const [registerDateQuery, setRegisterDateQuery] = useState<{ fromDate?: Date; toDate?: Date } | undefined>({ fromDate: undefined, toDate: undefined })

  const { print: printDefective } = useItemReport('不良在庫一覧')
  const { print: printAmountPerLot } = useItemReport('ロット別在庫金額', { fromDate: registerDateQuery?.fromDate, toDate: registerDateQuery?.toDate, woodSpeciesId: selectedWoodSpeciesId, itemTypeId: selectedItemTypeId })
  const [exportDateQuery, setExportDateQuery] = useState<{ fromDate?: Date; toDate?: Date } | undefined>({ fromDate: dayjs().subtract(1, 'M').startOf('month').toDate(), toDate: dayjs().subtract(1, 'M').endOf('month').toDate() })

  const { print: printBookList } = useHistoryReport('受注予約一覧')
  const { print: printEstimate } = useHistoryReport('見積一覧')
  const { print: printMonthlyRecord } = useHistoryReport('受注出庫一覧', exportDateQuery?.fromDate, exportDateQuery?.toDate)

  const { isOpen: isMonthlyRecordModalOpen, onClose: onMonthlyRecordModalClose, onOpen: onMonthlyRecordModalOpen } = useDisclosure()
  const { isOpen: isAmountPerLotModalOpen, onClose: onAmountPerLotModalClose, onOpen: onAmountPerLotModalOpen } = useDisclosure()

  return (
    <>
      <Container mt="50px" maxWidth="92%" ml="auto" mr="auto">
        <Heading size="md">一覧出力</Heading>
        <SimpleGrid mt="20px" columns={3} spacing={10}>
          <Button
            bg="blue.300"
            size="lg"
            onClick={async (e) => {
              e.preventDefault()
              await printBookList()
            }}
          >
            受注予約一覧
          </Button>
          <Button
            bg="blue.300"
            size="lg"
            onClick={async (e) => {
              e.preventDefault()
              await printDefective()
            }}
          >
            不良在庫一覧
          </Button>
          <Button
            bg="blue.300"
            size="lg"
            onClick={async (e) => {
              e.preventDefault()
              await printEstimate()
            }}
          >
            見積一覧
          </Button>
          <Button
            bg="blue.300"
            size="lg"
            onClick={(e) => {
              e.preventDefault()
              onMonthlyRecordModalOpen()
            }}
          >
            受注出庫一覧
          </Button>
          <Button
            bg="blue.300"
            size="lg"
            onClick={(e) => {
              e.preventDefault()
              onAmountPerLotModalOpen()
            }}
          >
            ロット別在庫金額
          </Button>
        </SimpleGrid>
      </Container>
      {/* 受注出荷一覧 */}
      <Dialog
        size="2xl"
        title="日付選択"
        onClose={onMonthlyRecordModalClose}
        isOpen={isMonthlyRecordModalOpen}
        button1={{
          text: '出力',
          color: 'blue',
          event: async () => {
            await printMonthlyRecord()
            onMonthlyRecordModalClose()
          }
        }}
      >
        <VStack align="left" pl="10">
          <HStack>
            <Box>
              <InputGroup>
                <InputLeftAddon>出荷日</InputLeftAddon>
                <Input
                  type="date"
                  value={exportDateQuery?.fromDate ? dayjs(exportDateQuery?.fromDate).format('YYYY-MM-DD') : undefined}
                  onChange={(e) => {
                    setExportDateQuery({ ...exportDateQuery, fromDate: e.target.valueAsDate ?? undefined })
                  }}
                />
                <InputLeftAddon>～</InputLeftAddon>
                <Input
                  type="date"
                  value={exportDateQuery?.toDate ? dayjs(exportDateQuery?.toDate).format('YYYY-MM-DD') : undefined}
                  onChange={(e) => {
                    setExportDateQuery({ ...exportDateQuery, toDate: e.target.valueAsDate ?? undefined })
                  }}
                />
              </InputGroup>
            </Box>
          </HStack>
        </VStack>
      </Dialog>
      {/* ロット別在庫金額 */}
      <Dialog
        size="2xl"
        title="日付選択"
        onClose={onAmountPerLotModalClose}
        isOpen={isAmountPerLotModalOpen}
        button1={{
          text: '出力',
          color: 'blue',
          event: async () => {
            await printAmountPerLot()
            onAmountPerLotModalClose()
          }
        }}
      >
        <VStack align="left" pl="10">
          <Text fontWeight={'bold'}>登録日で抽出</Text>
          <HStack>
            <Box>
              <InputGroup>
                <InputLeftAddon>登録日</InputLeftAddon>
                <Input
                  type="date"
                  value={registerDateQuery?.fromDate ? dayjs(registerDateQuery?.fromDate).format('YYYY-MM-DD') : undefined}
                  onChange={(e) => {
                    setRegisterDateQuery({ ...registerDateQuery, fromDate: e.target.valueAsDate ?? undefined })
                  }}
                />
                <InputLeftAddon>～</InputLeftAddon>
                <Input
                  type="date"
                  value={registerDateQuery?.toDate ? dayjs(registerDateQuery?.toDate).format('YYYY-MM-DD') : undefined}
                  onChange={(e) => {
                    setRegisterDateQuery({ ...registerDateQuery, toDate: e.target.valueAsDate ?? undefined })
                  }}
                />
              </InputGroup>
            </Box>
          </HStack>
          <Text fontWeight={'bold'} pt={10}>
            樹種分類で抽出
          </Text>
          <HStack>
            <Box>
              <InputGroup>
                <InputLeftAddon>樹種</InputLeftAddon>
                <WoodSpeciesSelect
                  onSelect={(e) => {
                    setSelectedWoodSpeciesId(e.target.value ? Number(e.target.value) : undefined)
                  }}
                  value={selectedWoodSpeciesId}
                />
              </InputGroup>
            </Box>
            <Box>
              <InputGroup>
                <InputLeftAddon>分類</InputLeftAddon>
                <ItemTypeSelect
                  value={selectedItemTypeId}
                  onSelect={(select) => {
                    setSelectedItemTypeId(select?.id)
                  }}
                />
              </InputGroup>
            </Box>
          </HStack>
        </VStack>
      </Dialog>
    </>
  )
}
export default Report
