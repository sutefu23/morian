import React from 'react'
import { Select } from "@chakra-ui/react"
import { apiClient } from '~/utils/apiClient'
import { useAspidaQuery } from '@aspida/react-query'
import StatusBar from '../feedback/statusBar'
import { WoodSpeciesType } from '~/server/domain/entity/stock'

type Props = { 
  onSelect: (event:React.ChangeEvent<HTMLSelectElement>) => void;
  selected? : WoodSpeciesType["id"]
  required?: boolean
}
const select = ({ onSelect, selected, required }:Props) => {
  const { data: woodSpecieses, error: woodSpeciesErr } = useAspidaQuery(apiClient.master.species)
  if (woodSpeciesErr) return <StatusBar status="error" message="樹種の取得に失敗しました。"/>

  return (
    <Select 
      onChange={(e) => onSelect(e)}
      placeholder="選択して下さい"
      required={required}
      defaultValue={selected}
      >
      {
        woodSpecieses &&
          woodSpecieses.map(woodSpecies => (<option key={woodSpecies.id} value={woodSpecies.id}>{woodSpecies.name}</option>))
      }
      
    </Select>
  )
}



export default select
