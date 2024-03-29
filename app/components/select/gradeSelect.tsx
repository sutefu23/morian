import React from 'react'
import { Select } from '@chakra-ui/react'
import { apiClient } from '~/utils/apiClient'
import { useAspidaQuery } from '@aspida/react-query'
import StatusBar from '../feedback/statusBar'
import { GradeType } from '~/server/domain/entity/stock'
type Props = {
  onSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void
  selected?: GradeType['id']
  value?: GradeType['id']
  required?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xs'
  width?: string
  placeholder?: string
  bgcolor?: string
}
const GradeSelect = ({ onSelect, selected, required, placeholder = '選択してください。', value, size, width, bgcolor }: Props) => {
  const { data: grades, error: gradeErr } = useAspidaQuery(apiClient.master.grade)
  if (gradeErr) return <StatusBar status="error" message="グレードの取得に失敗しました。" />

  return (
    <Select size={size} onChange={(e) => onSelect(e)} placeholder={placeholder} required={required} defaultValue={selected} value={value ?? ''} w={width} backgroundColor={bgcolor}>
      {grades &&
        grades.map((grade) => {
          return (
            <option key={grade.id} value={grade.id}>
              {grade.name}
            </option>
          )
        })}
    </Select>
  )
}

export default GradeSelect
