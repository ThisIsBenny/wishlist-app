import apiService from '@/services/apiService'
import { Wishlist, WishlistItem } from '@/types'
import { ref } from 'vue'
import { toReactive } from '@vueuse/core'
const apiClient = apiService.getClient()

const refState = ref<Wishlist | any>({})
const isLoading = ref(false)
const hasError = ref(false)

const fetchBySlugUrl = async (slugText: string): Promise<void> => {
  isLoading.value = true
  try {
    const { data } = await apiClient.get(`/wishlist/${slugText}`)
    refState.value = data
  } catch (error: any) {
    console.error(error)
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

const updateItem = async (item: WishlistItem): Promise<void> => {
  await apiClient.put(`/wishlist/${item.wishlistId}/item/${item.id}`, item)
}

export const useWishlistStore = (slugText: string) => {
  fetchBySlugUrl(slugText)
  return {
    list: toReactive(refState),
    isLoading,
    hasError,
    updateItem,
  }
}
