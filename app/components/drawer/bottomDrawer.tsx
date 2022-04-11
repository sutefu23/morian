import React, { ReactNode } from "react"
import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay } from "@chakra-ui/react"

type Props = {
  title?: string,
  isOpen: boolean,
  onClose: () => void,
  children: ReactNode
}
const BottomDrawer = ({title, isOpen, onClose, children}:Props )=> {
  return (
    <Drawer
    isOpen={isOpen}
    placement='bottom'
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
export default BottomDrawer