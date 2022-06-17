import React from 'react'
import { Select } from "@chakra-ui/react"
import { apiClient } from '~/utils/apiClient'
import { useAspidaQuery } from '@aspida/react-query'
import StatusBar from '../feedback/statusBar'
import { UnitType } from '~/server/domain/entity/stock'

type Props = { 
  onSelect: (event:React.ChangeEvent<HTMLSelectElement>) => void;
  selected? : UnitType["id"]
  required?: boolean
  value?: UnitType["id"]
}
const UnitSelect = ({ onSelect, selected, required, value }:Props) => {
  const { data: units, error: unitErr } = useAspidaQuery(apiClient.master.unit)
  if (unitErr) return <StatusBar status="error" message="単位の取得に失敗しました。"/>

  return (
    <Select 
      onChange={(e) => onSelect(e)}
      placeholder="単位"
      required={required}
      defaultValue={selected}
      value={value}
    >
      {
        units &&
          units.map(unit => (<option key={unit.id} value={unit.id}>{unit.name}</option>))
      }
      
    </Select>
  )
}



export default UnitSelect
