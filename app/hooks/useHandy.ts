import { atom , useRecoilState } from 'recoil'
import { useEffect } from 'react';
const isHandyAtom = atom({
  key: 'isHandy',
  default: false,
});
const useHandy = () => {
  const [isHandy, setIsHandy] = useRecoilState(isHandyAtom);

  useEffect(()=>{
    const isHandy = navigator.userAgent.indexOf("BHT-1700") > -1
    setIsHandy(isHandy)
  },[navigator.userAgent])

  return {
    isHandy
  }
}
export default useHandy
