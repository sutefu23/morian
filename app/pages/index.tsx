import Head from 'next/head'
import { useCallback, useState } from 'react'
import { useQueryClient } from 'react-query'
import { useAspidaQuery } from '@aspida/react-query'
import { apiClient } from '~/utils/apiClient'
import type { Task } from '$prisma/client'
import styles from '~/styles/Home.module.css'
import type { FormEvent, ChangeEvent } from 'react'

const Home = () => {
  const queryClient = useQueryClient()



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
