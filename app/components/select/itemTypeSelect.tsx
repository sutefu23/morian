import React from 'react'
import { Select } from "@chakra-ui/react"
import { apiClient } from '~/utils/apiClient'
import { useAspidaQuery } from '@aspida/react-query'
import StatusBar from '../feedback/statusBar'
import { ItemTypeType } from '~/server/domain/entity/stock'

type Props = { 
  onSelect: (select:ItemTypeType|undefined) => void;
  selected? : ItemTypeType["id"]
  required?: boolean
  value?: ItemTypeType["id"]
  readOnly?:boolean
}
const ItemTypeSelect = ({ onSelect, selected, required, value, readOnly }:Props) => {
  const { data: itemTypes, error: itemTypeErr } = useAspidaQuery(apiClient.master.itemType)
  if (itemTypeErr) return <StatusBar status="error" message="商品カテゴリの取得に失敗しました。"/>

  return (
    <Select 
      onChange={(e) => {
        const id = Number(e.currentTarget.value)
        const select = itemTypes?.find(itm => itm.id === id)
        onSelect(select)
      }}
      placeholder="選択して下さい"
      isReadOnly={readOnly}
      required={required}
      defaultValue={selected}
      value={value}
    >
      {
        itemTypes &&
          itemTypes.map(itemType => (<option key={itemType.id} value={itemType.id}>{itemType.name}</option>))
      }
      
    </Select>
  )
}



export default ItemTypeSelect
