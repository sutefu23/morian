import React from 'react'
import { Select } from "@chakra-ui/react"
import { Status } from '~/server/domain/entity/stock'

type Props = { 
  onSelect: (event:React.ChangeEvent<HTMLSelectElement>) => void;
  selected? : number
  value? : number
  required?: boolean
}
const select = ({ onSelect, selected, required, value }:Props) => {
  return (
    <Select 
      onChange={(e) => onSelect(e)}
      placeholder="選択して下さい"
      required={required}
      defaultValue={selected}
      value={value}
    >
    <option
      key={Status.入庫} 
      value={Status.入庫}
      >入庫</option>
    <option
      key={Status.出庫} 
      value={Status.出庫}
      >出庫</option>      
    </Select>
  )
}



export default select
