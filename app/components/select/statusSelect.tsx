import React from 'react'
import { Select } from "@chakra-ui/react"
import { ReasonType } from '~/server/domain/entity/stock'
import { StockReason } from '~/server/domain/init/master'

type Props = { 
  onSelect: (event:React.ChangeEvent<HTMLSelectElement>) => void;
  selected? : ReasonType["id"]
  value? : ReasonType["id"]
  required?: boolean
}
const select = ({ onSelect, selected, required, value }:Props) => {
  const reasons = StockReason
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
          reasons.map(reason => {
            return (<option
              key={reason.id} 
              value={reason.id}
              >{reason.name}</option>)
          })
      }
      
    </Select>
  )
}



export default select
