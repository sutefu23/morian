import {
  SimpleGrid ,
  Button,
  Heading,
  Container,
  Input,
  InputGroup,
  InputLeftAddon,
  Box,
  HStack,
  VStack,
  useDisclosure
} from "@chakra-ui/react"
import { useState } from "react"
import useHistoryReport from "~/hooks/useHistoryReport"
import useItemReport from "~/hooks/useItemReport"
import usePageTitle from "~/hooks/usePageTitle"
import Dialog from "~/components/feedback/dialog"
import dayjs from "dayjs"
const Report = () => {
  const { print: printDefective } =  useItemReport("不良在庫一覧") 
  const { print: printAmountPerLot } = useItemReport("ロット別在庫金額")
  const { setTitle } = usePageTitle()
  const [dateQuery, setDateQuery] = useState<{fromDate?:Date, toDate?:Date}|undefined>({fromDate:dayjs().subtract(1, "M").startOf('month').toDate(), toDate:dayjs().subtract(1, "M").endOf('month').toDate()})

  const { print: printBookList } =  useHistoryReport("受注予約一覧") 
  const { print: printEstimate } =  useHistoryReport("見積一覧") 
  const { print: printMonthlyRecord } =  useHistoryReport("受注出庫一覧",dateQuery?.fromDate,dateQuery?.toDate) 

  const { isOpen: isDateSelectOpen, onClose:onDateSelectClose, onOpen: onDateSelectOpen} = useDisclosure()

  setTitle("帳票出力")
  return (
    <>
    <Container mt="50px" maxWidth="92%" ml="auto" mr="auto" >
    <Heading size="md">一覧出力</Heading>
    <SimpleGrid mt="20px" columns={3} spacing={10}>
      <Button bg='blue.300'
        size="lg"
        onClick={ async (e) => {
          e.preventDefault()
          await printBookList()
        }
      }
      >受注予約一覧</Button>
      <Button bg='blue.300'
        size="lg"
        onClick={ async (e) => {
          e.preventDefault()
          await printDefective()
        }
      }
      >不良在庫一覧</Button>
      <Button bg='blue.300'
        size="lg"
        onClick={ async (e) => {
          e.preventDefault()
          await printEstimate()
        }
      }
      >見積一覧</Button>
      <Button bg='blue.300'
        size="lg"
        onClick={ (e) => {
          e.preventDefault()
          onDateSelectOpen()
        }
      }
      >受注出庫一覧</Button>
      <Button bg='blue.300'
        size="lg"
        onClick={ async (e) => {
          e.preventDefault()
          await printAmountPerLot()
        }
      }
      >ロット別在庫金額</Button>
    </SimpleGrid>
    </Container>
    <Dialog 
      size="2xl"
      title="日付選択"
      onClose={onDateSelectClose}
      isOpen={isDateSelectOpen}
      button1={{
        text:"出力",
        color:"blue",
        event:async () => { 
          await printMonthlyRecord()
          onDateSelectClose()
        }
      }
      }
      >
      <VStack align="left" pl="10">
        <HStack>
          <Box>
            <InputGroup>
              <InputLeftAddon
              >出荷日</InputLeftAddon>
              <Input 
                type="date"
                value={dateQuery?.fromDate ? dayjs(dateQuery?.fromDate).format('YYYY-MM-DD'): undefined}
                onChange={(e) => { 
                  setDateQuery({...dateQuery, fromDate:e.target.valueAsDate ?? undefined})
                }}/>
                <InputLeftAddon
              >～</InputLeftAddon>
              <Input 
                type="date"
                value={dateQuery?.toDate ? dayjs(dateQuery?.toDate).format('YYYY-MM-DD'): undefined}
                onChange={(e) => { 
                  setDateQuery({...dateQuery, toDate:e.target.valueAsDate ?? undefined})
                }}/>
            </InputGroup>
          </Box>
        </HStack>
        </VStack>
    </Dialog>
    </>
  )
}
export default Report


