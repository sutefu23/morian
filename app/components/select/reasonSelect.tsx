import React from 'react'
import { Select } from "@chakra-ui/react"
import { apiClient } from '~/utils/apiClient'
import { useAspidaQuery } from '@aspida/react-query'
import StatusBar from '../feedback/statusBar'
import { ReasonType, Status, 入庫理由 } from '~/server/domain/entity/stock'

type Props = { 
  onSelect: (event:React.ChangeEvent<HTMLSelectElement>) => void;
  selected? : ReasonType["id"]
  required?: boolean
  status?:Status
  value?: ReasonType["id"]
  filter?:(value: ReasonType, index: number, array: ReasonType[]) => boolean
}
const ReasonSelect = ({ onSelect, selected, required, value, status, filter}:Props) => {
  const { data, error: reasonErr } = useAspidaQuery(apiClient.master.reason)
  if (reasonErr) return <StatusBar status="error" message="理由カテゴリの取得に失敗しました。"/>
  let reasons = data?.filter(r => r.status === status && r.name !== 入庫理由.発注)
  if(filter){
    reasons = reasons?.filter(filter)
  }
  return (
    <Select 
      onChange={(e) => onSelect(e)}
      placeholder="選択して下さい"
      required={required}
      defaultValue={selected}
      value={value}
    >
      {
        reasons &&
          reasons.map(reason => (<option key={reason.id} value={reason.id}>{reason.name}</option>))
      }
      
    </Select>
  )
}



export default ReasonSelect
