import aspida from '@aspida/axios'
import api from '~/server/api/$api'
import axios, { AxiosError, isAxiosError } from 'axios'
import { parseCookies } from 'nookies'

const cookies = parseCookies()
const instance = axios.create()
instance.interceptors.request.use(
  function (config) {
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  function (response) {
    return response
  },
  function (error: unknown) {
    if (isAxiosError(error)) {
      if (error.response?.data.message) {
        alert(error.response?.data.message)
      }
      console.error(error.response?.data)
      return Promise.reject(error.response?.data)
    } else {
      alert('エラーが発生しました')
      console.error(error)
      return Promise.reject(error)
    }
  }
)

export const apiClient = api(aspida(instance, { headers: { token: cookies.token } }))
