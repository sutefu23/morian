import { atom, useRecoilValue, useRecoilCallback } from 'recoil'

const pageTitleState = atom({
  key: 'pageTitleState',
  default: ''
})

const usePageTitle = () => {
  const title = useRecoilValue(pageTitleState)
  const setTitle = useRecoilCallback(({ set }) => (page: string) => {
    set(pageTitleState, page)
  })

  return { title, setTitle }
}
export default usePageTitle
