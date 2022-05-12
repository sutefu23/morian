import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  ThemeTypings,
} from "@chakra-ui/react"

type Props = {
  title?: string,
  children: React.ReactNode,
  isOpen: boolean,
  onClose: () => void
  button1?:{
    text: string,
    color: ThemeTypings["colorSchemes"],
    event?: () => void,
  },
  button2?:{
    text: string,
    color: ThemeTypings["colorSchemes"],
    event: () => void,
  }
}

const Dialog = ({title, children, isOpen, button1 = {text:"OK", color:"blue"}, button2, onClose}:Props) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {children}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={button1.color} mr={3} onClick={button1.event??onClose}>
              {button1.text}
            </Button>
            {
              button2 && (
                <Button colorScheme={button2.color} mr={3} onClick={button2.event??onClose}>
                  {button2.text}
                </Button>
              )
            }
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
export default Dialog