import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosHeaders,
} from 'axios'
import { apiConfig } from '@/config'
import { ref } from 'vue'

interface CustomAxiosError extends AxiosError {
  ignore: boolean
}

const isLoading = ref(false)
const error = ref<CustomAxiosError | null>(null)

const config: InternalAxiosRequestConfig = {
  baseURL: apiConfig.baseURL,
  headers: new AxiosHeaders(),
}

const client: AxiosInstance = axios.create(config)

const requestInterceptor = client.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    isLoading.value = true
    error.value = null

    return config
  },
  (err: CustomAxiosError): Promise<CustomAxiosError> => {
    isLoading.value = false
    error.value = err
    return Promise.reject(err)
  }
)

const responseInterceptor = client.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    isLoading.value = false
    return response
  },
  (err: CustomAxiosError): Promise<CustomAxiosError> => {
    isLoading.value = false
    if (err.response?.status === 404) {
      import('../router').then((mod) => mod.default.push({ name: 'notFound' }))
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
