import { apiConfig } from '@/config'
import { useAuth } from './useAuth'
import { createFetch } from '@vueuse/core'
import router from '../router'

const { token } = useAuth()

export const useFetch = createFetch({
  baseUrl: apiConfig.baseURL,
  options: {
    beforeFetch({ options }) {
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `API-Key ${token.value}`,
        }
      }

      return { options }
    },
    onFetchError(ctx) {
      if (ctx.data && ctx.data.statusCode === 404) {
        router.push({ name: 'notFound' })
      }

      return ctx
    },
  },
})
