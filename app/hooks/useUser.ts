import { atom , useRecoilValue, useRecoilCallback } from 'recoil'
import { apiClient } from '~/utils/apiClient'
import { setCookie, parseCookies, destroyCookie } from 'nookies'
export type User = {
  id: number
  name: string,
}
export type LoginParam = {
  userId: number,
  userPass: string
}

const userState = atom<User|null>({
  key: 'userState',
  default: null,
});

const fetchUser = async () => {
  const cookies = parseCookies()

  if(cookies.token){
    const res = await apiClient.me.get({headers: {authorization: cookies.token}})
    if(res instanceof Error){
      return res
    }
    return res.body
  }
}

const useUser = () => {

  const login = async ({userId, userPass}:LoginParam) => {
    const res = await apiClient.login.post({ body: { id: Number(userId), pass: userPass} })
    if (res.status === 201){
      setCookie(null, 'token', res.body.token, {
        maxAge: 30 * 24 * 60 * 60,
      })  
      const user = await fetchUser()
      return user
    }
  }
  const logout = useRecoilCallback(({ set }) => () => {
    set(userState, null);
    destroyCookie(null, 'token')
  });
  const user = useRecoilValue(userState)
  const setUser = useRecoilCallback(({ set }) => (user: User|null) => {
    set(userState, user);
  });
  return {user, setUser, fetchUser, login, logout}
}
export default useUser
