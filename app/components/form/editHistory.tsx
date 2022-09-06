import React, { useCallback, useEffect, useState } from 'react'
import { ReasonSelect, StatusSelect, UserSelect } from '~/components/select'
import Dialog from '~/components/feedback/dialog'
import useHistory from '~/hooks/useHistory'
import { HStack, Box, VStack, InputGroup, InputLeftAddon, Input, Text, InputRightAddon } from "@chakra-ui/react"
import dayjs from 'dayjs'
import { StockReason } from '~/server/domain/init/master'
import { Decimal } from "decimal.js"
import { 出庫理由 } from '~/server/domain/entity/stock'
import useUser from '~/hooks/useUser'

type ItemSummary = {
  lotNo: string,
  name: string,
  size: string,
  count: string,
  unit: string
}
type Props = {
  isOpen:boolean
  onClose:()=>void
  editHistoryId?: number|undefined,
  mode: '新規作成'|'編集'
  itemId:number, 
  summary?: ItemSummary,
  unit:string,
  onlyUseSettledReason?: boolean,
  onDone:()=>void
} 
const EditHistory = ({isOpen , onClose, onDone, editHistoryId, itemId, mode, summary, unit, onlyUseSettledReason}:Props) => {
  const { historyData, setHistoryData, updateField, updateHistory, postHistory, defaultData } = useHistory()
  const [isBook, setIsBook] = useState<boolean>(false)
  const { user } = useUser()

  useEffect(()=>{
    setHistoryData({...defaultData, itemId: itemId, editUserId: user?.id, editUserName: user?.name})  
  },[defaultData, itemId, setHistoryData, user?.id, user?.name])

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
  },[mode, postHistory, editHistoryId, updateHistory, onDone])
  return (
    <Dialog
      isOpen={isOpen} 
      onClose={onClose} 
      title={mode}
      closeOnOverlayClick={false}
      size="xl"
      button1={{text:"登録",color:"green",event:handleRegister}}
      button2={{text:"キャンセル", color:"blue", event:onClose}}
      >
      {summary && 
      <Text textAlign="center" fontSize="1.2em" mb="4px">
        {summary.name} {summary.size}  {summary.count} {summary.unit}  
      </Text>}
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
                filter={onlyUseSettledReason?(r) => r.name !==出庫理由.見積 && r.name !== 出庫理由.受注予約:undefined}
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
              <InputRightAddon>{unit}</InputRightAddon>
            </InputGroup>
            )}
            {historyData.status == 2 && (
            <InputGroup>
              <InputLeftAddon aria-required>出庫数</InputLeftAddon>
              <Input required 
              value={String(historyData.reduceCount)}
              type="number" placeholder="数字" onChange={(e) => { updateField<"reduceCount">("reduceCount", e.target.value ? new Decimal(e.target.value): undefined)}}/>
              <InputRightAddon>{unit}</InputRightAddon>
            </InputGroup>
            )}
            
          </Box>
        </HStack>
        <HStack>
          <Box width="75vw" >
            <InputGroup>
              <InputLeftAddon bgColor="blue.100">備考</InputLeftAddon>
              <Input 
              defaultValue={historyData.note}
              onBlur={(e) => { updateField<"note">("note", e.target.value)}}/>
            </InputGroup>
          </Box>
        </HStack>
        {
          isBook &&
          <>
          <HStack>
            <Box width="75vw" >
              <InputGroup>
                <InputLeftAddon bgColor="blue.100">予約期限</InputLeftAddon>
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
                    const {options, selectedIndex} = e.target
                    setHistoryData({...historyData, bookUserId: Number(e.currentTarget.value), bookUserName: options[selectedIndex].innerHTML})
                  }}
                  />
              </InputGroup>
            </Box>
          </HStack>
          </>
        }

      </VStack>
    </Dialog>
  )
}

export default EditHistory