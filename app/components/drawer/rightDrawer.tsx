import React, { ReactNode } from "react"
import { useDisclosure, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay } from "@chakra-ui/react"
import { boolean } from "yup"

type Props = {
  title?: string,
  isOpen: boolean,
  onClose: () => void,
  onOpen: () => void
  children: ReactNode
}
const RightDrawer = ({title, isOpen, onClose, onOpen, children}:Props )=> {
  return (
    <Drawer
    isOpen={isOpen}
    placement='right'
    onClose={onClose}
  >
    <DrawerOverlay />
    <DrawerContent>
      <DrawerCloseButton
        onClick={onClose}
      />
      <DrawerHeader>{title}</DrawerHeader>

      <DrawerBody>
        {children}
      </DrawerBody>


    </DrawerContent>
  </Drawer>
  )
}
export default RightDrawer