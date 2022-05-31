import {
  SimpleGrid ,
  Button,
  Heading,
  Container
} from "@chakra-ui/react"
import { useState } from "react"
import useHistoryReport from "~/hooks/useHistoryReport"
import useItemReport from "~/hooks/useItemReport"
import usePageTitle from "~/hooks/usePageTitle"

const Report = () => {
  const { print: printDefective } =  useItemReport("不良在庫一覧") 
  const { print: printAmountPerLot } = useItemReport("ロット別在庫金額")
  const { setTitle } = usePageTitle()
  const [dateQuery, setDateQuery] = useState<{fromDate:Date, toDate:Date}|undefined>(undefined)

  const { print: printBookList } =  useHistoryReport("受注予約一覧") 
  const { print: printEstimate } =  useHistoryReport("見積一覧") 

  setTitle("帳票出力")
  return (
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
      onClick={ async (e) => {
        e.preventDefault()
        if(dateQuery && dateQuery.fromDate && dateQuery.toDate){
          // await printMonthlyRecord()
        }else{
          alert("日付が選択されていません")
        }
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
  )
}
export default Report


