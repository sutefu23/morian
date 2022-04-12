import React, { ReactNode } from "react"
import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay } from "@chakra-ui/react"

type Props = {
  title?: string,
  isOpen: boolean,
  onClose: () => void,
  height?: number | string
  children: ReactNode
}
const BottomDrawer = ({title, isOpen, onClose, height, children}:Props )=> {
  return (
    <Drawer
    isOpen={isOpen}
    placement='bottom'
    onClose={onClose}
    >
    <DrawerOverlay />
    <DrawerContent height={height}>
      <DrawerCloseButton
        onClick={onClose}
      />
      {title && <DrawerHeader>{title}</DrawerHeader>}

      <DrawerBody>
        {children}
      </DrawerBody>

    </DrawerContent>
  </Drawer>
  )
}
export default BottomDrawer