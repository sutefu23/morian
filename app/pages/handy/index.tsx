import { useAspidaQuery } from "@aspida/react-query"
import {
  Table,
  Tbody,
  Tr,
  Td,
  Text,
  Container,
  useDisclosure
} from "@chakra-ui/react"
import EditHistory from "~/components/form/editHistory"
import { useCallback, useEffect, useState } from "react"
import { apiClient } from '~/utils/apiClient'
import useUser from '~/hooks/useUser'
import dayjs from "dayjs"
interface Window {
  addEventListener:(type:string, callback:EventListener)=>void,
  ScanCallback:(arg: ScanArg)=>void,
  barcode: {
    data: string
  }
}
declare let window: Window

type ScanArg = {
 rawData: string,
 data: string,
 charSet: string,
 symbologyAim: string,
 symbologyDenso: string,
 privateDataLength: number
}

interface BHT_INIT {
  LoadPluginsCode: () => string
}
declare let bht_init: BHT_INIT

const Handy = () => {
  const [lotNo, setLotNo] = useState<string>("S-11111")
  const { user } = useUser()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { data: item} = useAspidaQuery(apiClient.historyList, {query: {
    lotNo: String(lotNo)
  },
  onSuccess:()=>{
    onOpen()
  }
  })
  const { data: itemHistory } = useAspidaQuery(apiClient.historyList.userEditedHistory, {query: {
    editUserId: user!.id
  },
  onSuccess:()=>{
    onOpen()
  }
  })

  useEffect(()=>{
    
    if (typeof bht_init == 'undefined') return
    if(typeof bht_init === undefined) {
      return;
    }
    const bht_js = eval(bht_init.LoadPluginsCode());
    bht_js.BarCodeScannerClaim();//読み取り許可
    
    bht_js.BarCodeScannerSetCallBackFunc({
      func: "ScanCallback"
    });
    
    if(process.env.NODE_ENV!=='development'){
      bht_js.SetFullScreenMode({mode: 1});//フルスクリーンモード 
    }
    const settings = bht_js.BarCodeScannerGetSettings();
    settings.decode.symbologies.code39.enabled = true;
    settings.decode.symbologies.code39.verifyCheckDigit = true;
    bht_js.BarCodeScannerSetSettings(settings);
  },[])

  useEffect(()=>{
    if (typeof bht_init == 'undefined') return
    window.ScanCallback = function(arg) {
      setLotNo(arg.data)
    }
  },[lotNo])

  const handleOnClose = useCallback(()=>{
    onClose()
    setLotNo("")
  },[onClose])

  const handleOnDone = useCallback(()=>{
    onClose()
    setLotNo("")

  },[onClose])

  return (
    <>
      <Container>
        {lotNo || <Text textAlign="center" mt="20px">バーコードをスキャンしてください。</Text>}
        {lotNo}
        {item && 
        <EditHistory
        summary={{
          lotNo: item.lotNo,
          name:`${item.woodSpeciesName} ${item.itemTypeName}`,
          size:`${item.length}x${item.thickness}x${item.width}`,
          count:item.count.toString(),
          unit:item.unitName
        }}
        isOpen={isOpen}
        itemId={item.id}
        onClose={handleOnClose}
        mode="新規作成"
        onlyUseSettledReason={true}
        onDone={handleOnDone}
        />}
      {itemHistory && itemHistory?.length > 0 && 
        <Container mt="20px" padding="0">
        <Text fontWeight="bold">最近の履歴</Text>
        <Table>
        <Tbody>
          {
            itemHistory?.map(itm => (
              itm.history.map( history=> (
                <Tr key={history.id}>
                <Td>{dayjs(history.date).format("YY/MM/DD")}</Td>  
                <Td>{itm.lotNo}</Td>
                <Td>{history.status ==1 ?"出庫":"入庫"}</Td>
                <Td>{itm.woodSpeciesName} {itm.itemTypeName}</Td>
                <Td>{history.addCount ?? history.reduceCount}</Td>
              </Tr>
              ))
    
            ))
          }
        </Tbody>
      </Table>
      </Container>
      }
      </Container>
    </>
  )
}
export default Handy


