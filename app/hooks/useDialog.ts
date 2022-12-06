import { atom, useRecoilState } from 'recoil'
const useDialog = () => {
  const openDialogState = atom({
    key: 'openDialogState',
    default: false
  })
  const messageDialogState = atom({
    key: 'messageDialogState',
    default: ''
  })
  const titleDialogState = atom({
    key: 'titleDialogState',
    default: ''
  })

  const [isOpen, setIsOpen] = useRecoilState(openDialogState)
  const [message, setMessage] = useRecoilState(messageDialogState)
  const [title, setTitle] = useRecoilState(titleDialogState)
  return { isOpen, setIsOpen, message, setMessage, title, setTitle }
}
export default useDialog
