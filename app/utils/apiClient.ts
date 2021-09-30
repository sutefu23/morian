import aspida from '@aspida/axios'
import api from '~/server/api/$api'
import { parseCookies } from 'nookies';
const cookies = parseCookies();

export const apiClient = api(aspida(undefined, {headers: { token: cookies.token}}))
