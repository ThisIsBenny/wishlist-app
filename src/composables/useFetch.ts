import { apiConfig } from '@/config'
import { createFetch } from '@vueuse/core'

export const useFetch = createFetch({
  baseUrl: apiConfig.baseURL,
  options: {
    beforeFetch({ options }) {
      return { options }
    },
    onFetchError(ctx) {
      if (ctx.data && ctx.data.statusCode === 404) {
        import('../router').then((mod) => mod.default.push({ name: 'notFound' }))
      }

      return ctx
    },
  },
})
