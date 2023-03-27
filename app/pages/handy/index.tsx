import { useAspidaQuery } from '@aspida/react-query'
import {
  Table,
  Tbody,
  Tr,
  Td,
  Text,
  Container,
  useDisclosure
} from '@chakra-ui/react'
import EditHistory from '~/components/form/editHistory'
import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '~/utils/apiClient'
import useUser from '~/hooks/useUser'
import dayjs from 'dayjs'
interface Window {
  addEventListener: (type: string, callback: EventListener) => void
  ScanCallback: (arg: ScanArg) => void
  barcode: {
    data: string
  }
}
declare let window: Window

type ScanArg = {
  rawData: string
  data: string
  charSet: string
  symbologyAim: string
  symbologyDenso: string
  privateDataLength: number
}

interface BHT_INIT {
  LoadPluginsCode: () => string
}
declare let bht_init: BHT_INIT

const Handy = () => {
  const [lotNo, setLotNo] = useState<string>()
  const { user } = useUser()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { data: items } = useAspidaQuery(apiClient.historyList, {
    query: {
      lotNo: String(lotNo)
    },
    onSuccess: () => {
      onOpen()
    }
  })
  const item = items ? items[0] : undefined
  const { data: itemHistory, refetch } = useAspidaQuery(
    apiClient.historyList.userEditedHistory,
    {
      query: {
        editUserId: user?.id ?? 0
      },
      onSuccess: () => {
        onOpen()
      }
    }
  )

  useEffect(() => {
    if (typeof bht_init == 'undefined') return
    if (typeof bht_init === undefined) {
      return
    }
    const bht_js = eval(bht_init.LoadPluginsCode())
    bht_js.BarCodeScannerClaim() //読み取り許可

    bht_js.BarCodeScannerSetCallBackFunc({
      func: 'ScanCallback'
    })

    if (process.env.NODE_ENV !== 'development') {
      bht_js.SetFullScreenMode({ mode: 1 }) //フルスクリーンモード
    }
    const settings = bht_js.BarCodeScannerGetSettings()
    settings.decode.multiLineMode.symbology1st.symbologyType = 'CODE39'
    settings.decode.multiLineMode.symbology1st.verifyCheckDigit = false
    settings.decode.multiLineMode.symbology2nd.symbologyType = 'CODE39'
    settings.decode.multiLineMode.symbology2nd.verifyCheckDigit = false

    settings.decode.symbologies.code39.enabled = true
    settings.decode.symbologies.code39.verifyCheckDigit = false
    bht_js.BarCodeScannerSetSettings(settings)
  }, [])

  useEffect(() => {
    if (typeof bht_init == 'undefined') return
    window.ScanCallback = function (arg) {
      setLotNo(arg.data)
    }
  }, [lotNo])

  const handleOnClose = useCallback(() => {
    onClose()
    setLotNo('')
  }, [onClose])

  const handleOnDone = useCallback(() => {
    onClose()
    setLotNo('')
    refetch()
  }, [onClose, refetch])

  return (
    <>
      <Container>
        {lotNo || (
          <Text textAlign="center" mt="20px">
            バーコードをスキャンしてください。
          </Text>
        )}
        {item && (
          <EditHistory
            summary={{
              lotNo: item.lotNo,
              name: `${item.woodSpeciesName} ${item.itemTypeName}`,
              size: `${item.length}x${item.thickness}x${item.width}`,
              count: item.count.toString(),
              unit: item.unitName
            }}
            unit={item.unitName}
            isOpen={isOpen}
            itemId={item.id}
            onClose={handleOnClose}
            mode="新規作成"
            onlyUseSettledReason={true}
            onDone={handleOnDone}
          />
        )}
        {itemHistory && itemHistory?.length > 0 && (
          <Container mt="20px" padding="0">
            <Text fontWeight="bold">最近の履歴(7日間)</Text>
            <Table>
              <Tbody>
                {itemHistory?.map((itm) =>
                  itm.history.map((history) => (
                    <Tr key={history.id}>
                      <Td>{dayjs(history.date).format('YY/MM/DD')}</Td>
                      <Td>{itm.lotNo}</Td>
                      <Td>{history.status == 1 ? '入庫' : '出庫'}</Td>
                      <Td>
                        {itm.woodSpeciesName} {itm.itemTypeName}
                      </Td>
                      <Td>
                        {Number(history.addCount) > 0
                          ? history.addCount
                          : history.reduceCount}
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Container>
        )}
      </Container>
    </>
  )
}
export default Handy
