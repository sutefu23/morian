import React from 'react'
import { Select } from "@chakra-ui/react"
import { apiClient } from '~/utils/apiClient'
import { useAspidaQuery } from '@aspida/react-query'
import StatusBar from '../feedback/statusBar'
import { ReasonType } from '~/server/domain/entity/stock'

type Props = { 
  onSelect: (event:React.ChangeEvent<HTMLSelectElement>) => void;
  selected? : ReasonType["id"]
  required?: boolean

}
const select = ({ onSelect, selected, required }:Props) => {
  const { data: reasons, error: reasonErr } = useAspidaQuery(apiClient.master.reason)
  if (reasonErr) return <StatusBar status="error" message="理由カテゴリの取得に失敗しました。"/>

  return (
    <Select 
      onChange={(e) => onSelect(e)}
      placeholder="選択して下さい"
      required={required}
    >
      {
        reasons &&
          reasons.map(reason => (<option key={reason.id} value={reason.id} selected={(selected === reason.id)}>{reason.name}</option>))
      }
      
    </Select>
  )
}



export default select