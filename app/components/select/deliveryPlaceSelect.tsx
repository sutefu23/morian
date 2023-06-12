import React from 'react'
import { Select } from '@chakra-ui/react'
import { apiClient } from '~/utils/apiClient'
import { useAspidaQuery } from '@aspida/react-query'
import StatusBar from '../feedback/statusBar'
import { DeliveryPlaceType } from '~/server/domain/entity/stock'

type Props = {
  onSelect: (selected: DeliveryPlaceType) => void
  selected?: DeliveryPlaceType['id']
  required?: boolean
  value?: DeliveryPlaceType['id']
}
const DeliveryPlaceSelect = ({ onSelect, selected, required, value }: Props) => {
  const { data: deliveryPlaces, error: deliveryPlaceErr } = useAspidaQuery(apiClient.master.deliveryPlace)
  if (deliveryPlaceErr) return <StatusBar status="error" message="配送場所一覧の取得に失敗しました。" />

  return (
    <Select
      onChange={(e) => {
        const id = e.target.value ? Number(e.target.value) : undefined
        const selected = deliveryPlaces?.find((d) => d.id === id)
        if (selected) {
          onSelect(selected)
        }
      }}
      placeholder="選択して下さい"
      required={required}
      value={value}
      defaultValue={selected}
    >
      {deliveryPlaces &&
        deliveryPlaces.map((warehouse) => (
          <option key={warehouse.id} value={warehouse.id}>
            {warehouse.name}
          </option>
        ))}
    </Select>
  )
}

export default DeliveryPlaceSelect
