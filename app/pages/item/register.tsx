import usePageTitle from '~/hooks/usePageTitle'
import "~/utils/string"
import "~/utils/number"
import RegisterForm from '~/components/form/register'
import { 入庫理由 } from "~/server/domain/entity/stock"

const Register = () => {
  const { setTitle } = usePageTitle()
  setTitle("新規在庫登録")

  return (
    <>
    <RegisterForm status={入庫理由.仕入}/>
    </>
  )
}

export default Register