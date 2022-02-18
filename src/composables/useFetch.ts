import { apiConfig } from '@/config'
import { useAuth } from './useAuth'
import { createFetch } from '@vueuse/core'

const { token } = useAuth()

export const useFetch = createFetch({
  baseUrl: apiConfig.baseURL,
  options: {
    async beforeFetch({ options }) {
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `API-Key ${token.value}`,
        }
      }

      return { options }
    },
  },
  fetchOptions: {
    mode: 'cors',
  },
})
