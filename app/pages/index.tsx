import styles from '~/styles/Home.module.css'
import Sidebar from '~/components/navigation/sidebar'

const Home = () => {

  return (
    <>
    <div className={styles.container}>
      <main className={styles.main}>
      </main>
      <aside>
        <Sidebar></Sidebar>
      </aside>
    </div>
    </>
  )
}

export default Home
