import React, { useEffect } from 'react'
import { apiClient } from '~/utils/apiClient'
import { Supplier } from '~/server/domain/entity/stock'
import { Autocomplete, Item } from "~/components/combobox/autocomplete"
import { useAsyncList } from "react-stately";

type Props = { 
  onSelect: (event:React.Key) => void
  required?: boolean
  defaultKey?: number
}

const select = ({ onSelect, required, defaultKey}:Props) => {

  useEffect(() => {
    (async() => {
      if(defaultKey){
        const response = await apiClient.supplier._id(defaultKey).get()
        const data = await response.body
        if(data){
          list.setFilterText(data.name)
        }
      }
    })()
  }, [])
  const onSelectionChange = (key:React.Key) => {
    onSelect(key)
  };

  const list = useAsyncList<Supplier>({
    async load({ filterText }) {
      const res = await apiClient.supplier.get( { query: { name: filterText} } )
      return {
        items: res.body
      }          
    }
  });
  return (
    <Autocomplete
    aria-label="仕入先" 
    isRequired={required}
    items={list.items}
    inputValue={list.filterText}
    onInputChange={list.setFilterText}
    loadingState={list.loadingState}
    onLoadMore={list.loadMore}
    onSelectionChange={onSelectionChange}
  >
    {(item) => <Item key={item.key}>{item.name}</Item>}
  </Autocomplete>
  )
}



export default select
