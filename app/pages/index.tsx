import styles from '~/styles/Home.module.css'
import Sidebar from '~/components/sidebar'
import { useAspidaQuery } from '@aspida/react-query'
import { apiClient } from '~/utils/apiClient'
import router, { useRouter } from 'next/router'
import Dialog from '~/components/dialog'

const Home = () => {
  const { data: species, error } = useAspidaQuery(apiClient.master.species)
  if (!species) return <div>loading...</div>
  if (error) return <Dialog title="エラー" message={error}/>
  return (
    <div className={styles.container}>


      <main className={styles.main}>
        
      </main>
      <aside>
        <Sidebar links={[]} isOpen={true} onClose={()=>{null}}></Sidebar>
      </aside>
    </div>
  )
}

export default Home
