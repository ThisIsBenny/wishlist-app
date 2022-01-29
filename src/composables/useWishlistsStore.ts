import apiService from '@/services/apiService'
import { Wishlist } from '@/types'
import { reactive, ref } from 'vue'
const apiClient = apiService.getClient()
const prefix = '/wishlist'

export const getAll = async (): Promise<Wishlist[]> => {
  const { data } = await apiClient.get(prefix)
  return data
}

export const useWishlistsStore = async () => {
  const lists = reactive(await getAll())
  return reactive({
    lists,
  })
}
