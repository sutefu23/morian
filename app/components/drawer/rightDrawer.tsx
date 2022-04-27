import React, { ReactNode } from "react"
import {  Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay } from "@chakra-ui/react"
import { number } from "yup"

type Props = {
  title?: string,
  width?: string|number,
  isOpen: boolean,
  onClose: () => void,
  children: ReactNode
}
const RightDrawer = ({title, width, isOpen, onClose, children}:Props )=> {
  return (
    <Drawer
    isOpen={isOpen}
    placement='right'
    onClose={onClose}
  >
    <DrawerOverlay />
    <DrawerContent maxWidth={width}>
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
export default RightDrawer