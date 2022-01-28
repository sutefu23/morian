import aspida from '@aspida/axios'
import api from '~/server/api/$api'
import axios, { AxiosError } from 'axios';
import { parseCookies } from 'nookies';

const cookies = parseCookies();
const instance = axios.create()
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Do something with response data
  return response;
}, function (error: AxiosError) {
  // Do something with response error
  alert(error.response?.data.message)
  console.error(error.response?.data)
  return Promise.reject(error.response?.data);
});

export const apiClient = api(aspida(instance, {headers: { token: cookies.token}}))
