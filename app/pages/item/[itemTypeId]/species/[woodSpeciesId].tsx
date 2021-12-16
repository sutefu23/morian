import { useRouter } from 'next/router'
import PageHeader from '~/components/sections/itemList/PageHeader'
import PageBody from '~/components/sections/itemList/PageBody'
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