import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { apiConfig } from '@/config'

const config: AxiosRequestConfig = {
  baseURL: apiConfig.baseURL,
}

const client: AxiosInstance = axios.create(config)

export default {
  getClient: () => {
    return client
  },
}
