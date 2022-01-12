import { atom , useRecoilValue, useRecoilCallback } from 'recoil'

const openSidebarState = atom({
  key: 'openSidebarState',
  default: false,
});

const useSidebar = () => {
  
  const isOpen = useRecoilValue(openSidebarState);
  const setIsOpen = useRecoilCallback(({ set }) => (isopen: boolean) => {
    set(openSidebarState, isopen);
  });
  return {isOpen, setIsOpen}
}
export default useSidebar