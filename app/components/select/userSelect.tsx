import React, {useEffect, useState} from 'react'
import { Select } from "@chakra-ui/react"
import { apiClient } from '~/utils/apiClient'
import StatusBar from '../feedback/statusBar'
import { User } from '~/server/domain/entity/user'

type Props = { 
  onSelect: (event:React.ChangeEvent<HTMLSelectElement>) => void;
  selected? : User
  required?: boolean
  enableOnly?: boolean
}
const select = ({ onSelect, selected, required , enableOnly}:Props) => {
  const [ users, setUsers ] = useState<User[]>()
  const [ error , setError ] = useState<Error>()

  useEffect(()=>{(async () => {
    const { body, status } = await apiClient.user.get({query:{enable: enableOnly}})
    if(status === 200){
      setUsers(body)
    }else{
      const error = new Error("ユーザー取得に失敗しました")
      setError(error)
    }
  })()
  },[users])

  if(error) return <StatusBar status="error" message={error.message}></StatusBar>

  return (
    <Select 
      onChange={(e) => onSelect(e)}
      placeholder="選択して下さい"
      required={required}
    >
      {
        users &&
          users.map(user => (<option key={user.id} value={user.id} selected={(selected?.id === user.id)}>{user.name}</option>))
      }
      
    </Select>
  )
}



export default select
