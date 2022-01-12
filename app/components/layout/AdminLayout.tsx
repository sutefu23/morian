import React, {useEffect} from 'react'
import Navibar from '~/components/header/navibar'
import styles from '~/styles/Home.module.css'
import Sidebar from '~/components/navigation/sidebar'
import useUser from '~/hooks/useUser';
import { useRouter } from 'next/router'

type Props = {
  children?: React.ReactNode;
};
const AdminLayout = ({children} :Props) => {
  const router = useRouter();
      
  const {user, setUser, fetchUser, logout} = useUser()
  const url = router.pathname

  useEffect(()=>{(async () => {
    if(!user){
      const userData = await fetchUser()
      if(userData instanceof Error){
        throw userData
      }
      if(userData){
        setUser(userData)
      }
    }
  })()
  },[user])
  return (url !== '/login' ?
    <>
    <Navibar/>
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
