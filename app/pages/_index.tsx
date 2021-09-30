import Head from 'next/head'
import { useCallback, useState } from 'react'
import { useQueryClient } from 'react-query'
import { useAspidaQuery } from '@aspida/react-query'
import { apiClient } from '~/utils/apiClient'
import type { Task } from '$prisma/client'
import styles from '~/styles/Home.module.css'
import type { FormEvent, ChangeEvent } from 'react'

const Home = () => {
  // const queryClient = useQueryClient()
  // const { data: tasks, error } = useAspidaQuery(apiClient.user.get({token}))
  // const [label, setLabel] = useState('')


  // const userLogin = useCallback(
  //   async (e: FormEvent) => {
  //     e.preventDefault()
  //     if (!label) return

  //     await apiClient.user.post({ body: {id: 1 , name: "pass", pass: "pass"} })
  //   },
  //   [userId, pass]
  // )



  // if (error) return <div>failed to load</div>
  // if (!tasks) return <div>loading...</div>

  return (
    <div className={styles.container}>
      <Head>
        <title>frourio-todo-app</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <main className={styles.main}>


        <p className={styles.description}>frourio-todo-app</p>

        <div>
          
        </div>
      </main>

    </div>
  )
}

export default Home
