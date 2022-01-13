import React from 'react'
import { Select } from "@chakra-ui/react"
import { apiClient } from '~/utils/apiClient'
import { useAspidaQuery } from '@aspida/react-query'
import StatusBar from '../feedback/statusBar'
import { Supplier } from '~/server/domain/entity/stock'
import { Autocomplete, Item } from "~/components/combobox/autocomplete"
type Props = { 
  onSelect: (event:React.ChangeEvent<HTMLSelectElement>) => void;
  selected? : Supplier
  required?: boolean
}
const select = ({ onSelect, selected, required }:Props) => {
  const { data: suppliers, error: supplierErr } = useAspidaQuery(apiClient.master)
  if (supplierErr) return <StatusBar status="error" message="商品カテゴリの取得に失敗しました。"/>

  return (
    <Select 
      onChange={(e) => onSelect(e)}
      placeholder="選択して下さい"
      required={required}
    >
      {
        suppliers &&
          suppliers.map(supplier => (<option key={supplier.id} value={supplier.id} selected={(selected?.id === supplier.id)}>{supplier.name}</option>))
      }
      
    </Select>
  )
}



export default select
