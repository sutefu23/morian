import { useAspidaQuery } from '@aspida/react-query'
import {
  Box,
  Button,
  VStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { WoodSpeciesType } from '~/server/domain/entity/stock'
import { apiClient } from '~/utils/apiClient'
import router, { useRouter } from 'next/router'

interface Link {
  key: number|string
  name: string
  path: string
}
interface Props {
  links: Link[]
  onClose: () => void
  isOpen: boolean
}

const SidebarContent = ({ onClick }: { onClick: () => void }) => {
  const [_ , setSpecies ] = useState<WoodSpeciesType[]>([])
  const { data: species, error } = useAspidaQuery(apiClient.master.species)
  if (!species) return <div>loading...</div>
  return ( 
  
  <VStack>

    {species.map(s => 
      <Button onClick={onClick} w="100%" key={s.id}>{s.name}</Button>
    )}

  </VStack>)
}


const Sidebar = ({ links, onClose }: Props) => {
  return  (
    <Box
      position="fixed"
      left={0}
      p={5}
      w="200px"
      top={0}
      h="100%"
      bg="#dfdfdf"
    >
      {links.map(link => {
        <Button onClick={() => {router.push(link.path)}} w="100%" key={link.key}>{link.name}</Button>
      })}
    </Box>
  ) 
}

export default Sidebar
