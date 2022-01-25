import React from 'react'
import { apiClient } from '~/utils/apiClient'
import { Supplier } from '~/server/domain/entity/stock'
import { Autocomplete, Item } from "~/components/combobox/autocomplete"
import { useAsyncList } from "react-stately";

type Props = { 
  onSelect: (event:React.ChangeEvent<HTMLSelectElement>) => void;
  selected? : Supplier["id"]
  required?: boolean
}
const select = ({ onSelect, selected, required }:Props) => {

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
    isRequired={required}
    items={list.items}
    inputValue={list.filterText}
    onInputChange={list.setFilterText}
    loadingState={list.loadingState}
    onLoadMore={list.loadMore}
  >
    {(item) => <Item key={item.name}>{item.name}</Item>}
  </Autocomplete>
  )
}



export default select
