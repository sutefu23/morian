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
}
const select = ({ onSelect, selected, required, value, status}:Props) => {
  const { data, error: reasonErr } = useAspidaQuery(apiClient.master.reason)
  if (reasonErr) return <StatusBar status="error" message="理由カテゴリの取得に失敗しました。"/>
  const reasons = data?.filter(r => r.status === status && r.name !== 入庫理由.発注)
  
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



export default select
