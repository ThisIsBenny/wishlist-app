import apiService from '@/services/apiService'
import { Wishlist } from '@/types'
import { ref } from 'vue'
const apiClient = apiService.getClient()
const prefix = '/wishlist'

const refState = ref<Wishlist[]>([])
const isLoading = ref(false)
const hasError = ref(false)

export const loadAll = async (): Promise<void> => {
  isLoading.value = true
  try {
    const { data } = await apiClient.get(prefix)
    refState.value = data
  } catch (error: any) {
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

export const useWishlistsStore = () => {
  loadAll()
  return {
    lists: refState,
    hasError,
    isLoading,
  }
}
