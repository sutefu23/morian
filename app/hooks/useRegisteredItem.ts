import { apiClient } from '~/utils/apiClient'
import { useCallback } from 'react'
import type { PartialUpdateItemData } from '$/domain/service/stock'

const useRegisteredItem = () => {

  const editRegisteredItem =  useCallback(async (id: number, item:PartialUpdateItemData) => {
    await apiClient.item._id(id).patch({
      body: {
        id: id,
        data: item
      }
    })
  },[])

  const deleteRegisterdItem = useCallback(async (itemId: number) => {
    await apiClient.item._id(itemId).delete()
  },[])

  return {
    editRegisteredItem,
    deleteRegisterdItem
  }
}

export default useRegisteredItem