import React, { useEffect } from 'react'
import { apiClient } from '~/utils/apiClient'
import { Autocomplete, Item } from "~/components/combobox/autocomplete"
import { useAsyncList } from "react-stately";
import { SupplierDTO } from '~/server/domain/dto/supplier';

type Props = { 
  onSelect: (selected: {id: number, name: string}) => void
  required?: boolean
  defaultKey?: number
  readOnly?:boolean
}

const SupplierSelect = ({ onSelect, required, defaultKey, readOnly}:Props) => {

  useEffect(() => {
    (async() => {
      if(defaultKey){
        const response = await apiClient.supplier._id(defaultKey).get()
        const data = response.body
        if(data){
          list.setFilterText(data.name)
        }
      }
    })()
  }, [defaultKey])
  const onSelectionChange = async (key:React.Key) => {
    const response = await apiClient.supplier._id(Number(key)).get()
    if(response.body){
      onSelect({
        id : response.body?.id,
        name: response.body?.name
      })  
    }
  };

  const list = useAsyncList<SupplierDTO>({
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
    readOnly={readOnly}
    isRequired={required}
    items={list.items}
    inputValue={list.filterText}
    onInputChange={list.setFilterText}
    loadingState={list.loadingState}
    onLoadMore={list.loadMore}
    onSelectionChange={onSelectionChange}
  >
    {(item) => <Item key={item.id}>{item.name}</Item>}
  </Autocomplete>
  )
}



export default SupplierSelect
