import React, { useCallback } from 'react'
import { ReasonSelect, StatusSelect, UserSelect } from '~/components/select'
import Dialog from '~/components/feedback/dialog'
import useHistory from '~/hooks/useHistory'
import { HStack, Box, VStack, InputGroup, InputLeftAddon, Input } from "@chakra-ui/react"
import dayjs from 'dayjs'
import { StockReason } from '~/server/domain/init/master'
import { Decimal } from "decimal.js"

type Props = {
  isOpen:boolean
  onClose:()=>void
  editHistoryId: number|undefined 
  mode: '新規作成'|'編集'
} 
const editHistory = ({isOpen , onClose, editHistoryId, mode}:Props) => {
  const { historyData, setHistoryData, updateField, updateHistory, postHistory } = useHistory()

  const handleRegister = useCallback(()=>{
    switch (mode) {
      case "新規作成":
        postHistory()
        onClose()
        break;
      case "編集":
        if(!editHistoryId){
          alert("IDが存在しません")
          return
        }
        updateHistory(editHistoryId)        
        onClose()
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
                    ...{
                      status: Number(e.currentTarget.value),
                      reduceCount: new Decimal(0),
                      addCount: new Decimal(0),
                      reason: undefined
                    }
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
                value={StockReason.find(r => r.name === historyData.reason)?.id}
                status={historyData.status}
                onSelect={(e) => { 
                updateField<"reason">("reason",StockReason.find(r => r.id === Number(e.currentTarget.value))?.name)}}/>
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
      </VStack>
    </Dialog>
  )
}

export default editHistory