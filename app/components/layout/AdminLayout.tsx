import React, {useEffect} from 'react'
import Navibar from '~/components/header/navibar'
import styles from '~/styles/Home.module.css'
import Sidebar from '~/components/navigation/sidebar'
import useUser from '~/hooks/useUser';
import useHandy from '~/hooks/useHandy';
import { useRouter } from 'next/router'

type Props = {
  children?: React.ReactNode;
};
const AdminLayout = ({children} :Props) => {
  const router = useRouter();
  const { isHandy } = useHandy()
  const {user, setUser, fetchUser} = useUser()
  const url = router.pathname

  useEffect(()=>{(async () => {
    if(!user && url !== '/login'){
      const userData = await fetchUser()
      if(userData instanceof Error || !userData){
        router.push('/login')
        return
      }
      setUser(userData)
    }
  })()
  },[fetchUser, router, setUser, url, user])

  useEffect(()=>{( () => {
    if(isHandy&& url!=='/handy' && url !== '/login'){
      router.push('/handy')
    }
  })()
  },[isHandy, router, url])
  
  return (url !== '/login' ?
    <>
    <Navibar hidden={isHandy}/>
    <div className={styles.container}>
      <main className={styles.main}>
      {children}
      </main>
      <aside>
        <Sidebar></Sidebar>
      </aside>
    </div>
    </>
    :
    <>
    {children}
    </>
    )
}

export default AdminLayout
