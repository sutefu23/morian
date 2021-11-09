import { useRouter } from 'next/router'
import PageHeader from '../sections/history/PageHeaer'
import PageBody from '../sections/history/PageBody'

const HistoryListPage = () => {
  const router = useRouter()
  const { itemTypeId, woodSpeciesId } = router.query

  return (
    <>
    <PageHeader/>
    <PageBody/>
    </>
  )
}

export default HistoryListPage