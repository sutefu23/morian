import { useRouter } from 'next/router'
import PageHeader from '~/components/sections/history/PageHeader'
import PageBody from '~/components/sections/history/PageBody'

const HistoryListPage = () => {
  const router = useRouter()
  const { lotId } = router.query

  return (
    <>
    <PageHeader/>
    <PageBody/>
    </>
  )
}

export default HistoryListPage