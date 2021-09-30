import {
  Box,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerContent,
  VStack,
} from '@chakra-ui/react'
import { useEffect } from 'react'
import { apiClient } from '~/utils/apiClient'
interface Props {
  onClose: () => void
  isOpen: boolean
  variant: 'drawer' | 'sidebar'
}
useEffect(() => {
}, [])
const SidebarContent = ({ onClick }: { onClick: () => void }) => (
  <VStack>
    <Button onClick={onClick} w="100%">
      在庫
    </Button>
    <Button onClick={onClick} w="100%">
      About
    </Button>
    <Button onClick={onClick} w="100%">
      Contact
    </Button>
  </VStack>
)

const Sidebar = ({ isOpen, variant, onClose }: Props) => {
  return variant === 'sidebar' ? (
    <Box
      position="fixed"
      left={0}
      p={5}
      w="200px"
      top={0}
      h="100%"
      bg="#dfdfdf"
    >
      <SidebarContent onClick={onClose} />
    </Box>
  ) : (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Chakra-UI</DrawerHeader>
          <DrawerBody>
            <SidebarContent onClick={onClose} />
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  )
}

export default Sidebar
