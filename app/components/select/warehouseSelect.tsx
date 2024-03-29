import React from 'react'
import { Select } from '@chakra-ui/react'
import { apiClient } from '~/utils/apiClient'
import { useAspidaQuery } from '@aspida/react-query'
import StatusBar from '../feedback/statusBar'
import { WarehouseType } from '~/server/domain/entity/stock'

type Props = {
  onSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void
  selected?: WarehouseType['id']
  required?: boolean
  value?: WarehouseType['id'] | ''
  size?: 'sm' | 'md' | 'lg' | 'xs'
  width?: string
  placeholder?: string
}
const WarehouseSelect = ({ onSelect, selected, required, value, size, width, placeholder = '検索してください。' }: Props) => {
  const { data: warehouses, error: warehouseErr } = useAspidaQuery(apiClient.master.warehouse)
  if (warehouseErr) return <StatusBar status="error" message="倉庫一覧の取得に失敗しました。" />

  return (
    <Select onChange={(e) => onSelect(e)} backgroundColor={'white'} placeholder={placeholder} required={required} value={value} defaultValue={selected} size={size} width={width}>
      {warehouses &&
        warehouses.map((warehouse) => (
          <option key={warehouse.id} value={warehouse.id}>
            {warehouse.name}
          </option>
        ))}
    </Select>
  )
}

export default WarehouseSelect
