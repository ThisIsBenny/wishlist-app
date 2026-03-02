import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders,
} from 'axios'
import { apiConfig } from '@/config'
import { ref } from 'vue'
import router from '../router'
import { useAuth } from './useAuth'

export interface CustomAxiosError extends AxiosError {
  ignore: boolean
}

const { token } = useAuth()
const isLoading = ref(false)
const error = ref<CustomAxiosError | null>(null)

const config: InternalAxiosRequestConfig = {
  baseURL: apiConfig.baseURL,
  headers: new AxiosHeaders(),
}

const client: AxiosInstance = axios.create(config)

export const requestInterceptor = client.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    isLoading.value = true
    error.value = null
    config.headers.Authorization = token.value ? `API-Key ${token.value}` : ''

    return config
  },
  (err: CustomAxiosError): Promise<CustomAxiosError> => {
    isLoading.value = false
    error.value = err
    return Promise.reject(err)
  }
)

export const responseInterceptor = client.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    isLoading.value = false
    return response
  },
  (err: CustomAxiosError): Promise<CustomAxiosError> => {
    isLoading.value = false
    if (err.response?.status === 404) {
      router.push({ name: 'notFound' })
      err.ignore = true
    } else {
      error.value = err
    }
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
