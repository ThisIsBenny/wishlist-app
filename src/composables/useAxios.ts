import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { apiConfig } from '@/config'
import { ref } from 'vue'

const isLoading = ref(false)
const error = ref(null)

const config: AxiosRequestConfig = {
  baseURL: apiConfig.baseURL,
}

const client: AxiosInstance = axios.create(config)

client.interceptors.request.use(
  function (config) {
    isLoading.value = true
    error.value = null
    return config
  },
  function (err) {
    isLoading.value = false
    error.value = err
    return Promise.reject(err)
  }
)

client.interceptors.response.use(
  function (response) {
    isLoading.value = false
    return response
  },
  function (err) {
    isLoading.value = false
    error.value = err
    return Promise.reject(err)
  }
)

export default () => {
  return {
    client,
    isLoading,
    error,
  }
}
