import React, { useCallback, useState } from 'react'
import { ReasonSelect, StatusSelect, UserSelect } from '~/components/select'
import Dialog from '~/components/feedback/dialog'
import useHistory from '~/hooks/useHistory'
import { HStack, Box, VStack, InputGroup, InputLeftAddon, Input } from "@chakra-ui/react"
import dayjs from 'dayjs'
import { StockReason } from '~/server/domain/init/master'
import { Decimal } from "decimal.js"
import { 出庫理由 } from '~/server/domain/entity/stock'

type Props = {
  isOpen:boolean
  onClose:()=>void
  editHistoryId: number|undefined 
  mode: '新規作成'|'編集'
  onDone:()=>void
} 
const editHistory = ({isOpen , onClose, onDone, editHistoryId, mode}:Props) => {
  const { historyData, setHistoryData, updateField, updateHistory, postHistory } = useHistory()
  const [isBook, setIsBook] = useState<boolean>(false)
  const handleRegister = useCallback(async ()=>{
    switch (mode) {
      case "新規作成":
        if(await postHistory()){
          onDone()
        }
        break;
      case "編集":
        if(!editHistoryId){
          alert("IDが存在しません")
          return
        }
        if(await updateHistory(editHistoryId)){
          onDone()
        }
        break;
    }
  },[historyData, editHistoryId])
  return (
    <Dialog
      isOpen={isOpen} 
      onClose={onClose} 
      title={mode}
      closeOnOverlayClick={false}
      size="xl"
      button1={{text:mode,color:"green",event:handleRegister}}
      button2={{text:"キャンセル", color:"blue", event:onClose}}
      >

      <VStack align="left" pl="10">
        <HStack>
          <Box>
            <InputGroup>
              <InputLeftAddon
              >入出庫日</InputLeftAddon>
              <Input required
                type="date"
                value={historyData.date ? dayjs(historyData.date).format('YYYY-MM-DD'): undefined}
                onChange={(e) => { 
                updateField<"date">("date", e.target.valueAsDate ?? undefined)}}/>
            </InputGroup>
          </Box>
        </HStack>
        <HStack>
          <Box>
            <InputGroup>
              <InputLeftAddon
              >ステータス</InputLeftAddon>
              <StatusSelect required
                value={historyData.status}
                onSelect={(e) => {
                  const newHistory = {
                    ...historyData,
                    status: Number(e.currentTarget.value),
                    reduceCount: new Decimal(0),
                    addCount: new Decimal(0),
                    reason: undefined
                  }
                  setHistoryData(newHistory)
                }}/>
            </InputGroup>
          </Box>
        </HStack>
        <HStack>
          <Box>
            <InputGroup>
              <InputLeftAddon
              >理由</InputLeftAddon>
              <ReasonSelect required
                value={historyData.reasonId}
                status={historyData.status}
                onSelect={(e) => { 
                const reasonBookId = StockReason.find(r => r.name === 出庫理由.受注予約)?.id
                const reasonEstimateId = StockReason.find(r => r.name === 出庫理由.見積)?.id
                setIsBook(Number(e.currentTarget.value)===reasonBookId || Number(e.currentTarget.value)===reasonEstimateId)
                updateField<"reasonId">("reasonId",Number(e.currentTarget.value))}}/>
            </InputGroup>
          </Box>
        </HStack>
        <HStack>
          <Box>
            {historyData.status == 1 && (
            <InputGroup>
              <InputLeftAddon aria-required>入庫数</InputLeftAddon>
              <Input required 
              value={String(historyData.addCount)}
              type="number" placeholder="数字" onChange={(e) => { updateField<"addCount">("addCount", e.target.value ? new Decimal(e.target.value): undefined)}}/>
            </InputGroup>
            )}
            {historyData.status == 2 && (
            <InputGroup>
              <InputLeftAddon aria-required>出庫数</InputLeftAddon>
              <Input required 
              value={String(historyData.reduceCount)}
              type="number" placeholder="数字" onChange={(e) => { updateField<"reduceCount">("reduceCount", e.target.value ? new Decimal(e.target.value): undefined)}}/>
            </InputGroup>
            )}
          </Box>
        </HStack>
        <HStack>
          <Box width="75vw" >
            <InputGroup>
              <InputLeftAddon bgColor="blue.100">備考</InputLeftAddon>
              <Input 
              value={historyData.note}
              onChange={(e) => { updateField<"note">("note", e.target.value)}}/>
            </InputGroup>
          </Box>
        </HStack>
        {
          isBook &&
          <>
          <HStack>
            <Box width="75vw" >
              <InputGroup>
                <InputLeftAddon bgColor="blue.100">予約日</InputLeftAddon>
                <Input
                  type="date"
                  value={historyData.bookDate ? dayjs(historyData.bookDate).format('YYYY-MM-DD'): undefined}
                  onChange={(e) => { 
                    updateField<"bookDate">("bookDate", e.target.valueAsDate ?? undefined)}}
                  />
              </InputGroup>
            </Box>
          </HStack>
          <HStack>
            <Box width="75vw" >
              <InputGroup>
                <InputLeftAddon bgColor="blue.100">予約者</InputLeftAddon>
                <UserSelect required
                  value={historyData.bookUserId ?? undefined}
                  onSelect={(e) => { 
                  updateField<"bookUserId">("bookUserId", Number(e.currentTarget.value))}}/>
              </InputGroup>
            </Box>
          </HStack>
          </>
        }

      </VStack>
    </Dialog>
  )
}

export default editHistory