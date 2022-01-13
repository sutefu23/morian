import React from 'react'
import { Select } from "@chakra-ui/react"
import { apiClient } from '~/utils/apiClient'
import { useAspidaQuery } from '@aspida/react-query'
import StatusBar from '../feedback/statusBar'
import { GradeType } from '~/server/domain/entity/stock'

type Props = { 
  onSelect: (event:React.ChangeEvent<HTMLSelectElement>) => void;
  selected? : GradeType
  required?: boolean
}
const select = ({ onSelect, selected, required }:Props) => {
  const { data: grades, error: gradeErr } = useAspidaQuery(apiClient.master.grade)
  if (gradeErr) return <StatusBar status="error" message="グレードの取得に失敗しました。"/>

  return (
    <Select 
      onChange={(e) => onSelect(e)}
      placeholder="選択して下さい"
      required={required}
    >
      {
        grades &&
          grades.map(grade => {
            (<option
              key={grade.id} 
              value={grade.id}
              selected={(selected?.id === grade.id)}
              >{grade.name}</option>)
          })
      }
      
    </Select>
  )
}



export default select
