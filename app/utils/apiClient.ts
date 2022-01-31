import aspida from '@aspida/axios'
import api from '~/server/api/$api'
import axios, { AxiosError } from 'axios';
import { parseCookies } from 'nookies';

const cookies = parseCookies();
const instance = axios.create()
instance.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
  return response;
}, function (error: AxiosError) {
  alert(error.response?.data.message)
  console.error(error.response?.data)
  return Promise.reject(error.response?.data);
});

export const apiClient = api(aspida(instance, {headers: { token: cookies.token}}))
