import React from 'react'
import { Select } from "@chakra-ui/react"
import { apiClient } from '~/utils/apiClient'
import { useAspidaQuery } from '@aspida/react-query'
import StatusBar from '../feedback/statusBar'
import { ItemTypeType } from '~/server/domain/entity/stock'

type Props = { 
  onSelect: (event:React.ChangeEvent<HTMLSelectElement>) => void;
  selected? : ItemTypeType
  required?: boolean

}
const select = ({ onSelect, selected, required }:Props) => {
  const { data: itemTypes, error: itemTypeErr } = useAspidaQuery(apiClient.master.itemType)
  if (itemTypeErr) return <StatusBar status="error" message="商品カテゴリの取得に失敗しました。"/>

  return (
    <Select 
      onChange={(e) => onSelect(e)}
      placeholder="選択して下さい"
      required={required}
    >
      {
        itemTypes &&
          itemTypes.map(itemType => (<option key={itemType.id} value={itemType.id} selected={(selected?.id === itemType.id)}>{itemType.name}</option>))
      }
      
    </Select>
  )
}



export default select
