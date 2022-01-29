import apiService from '@/services/apiService'
import { Wishlist, WishlistItem } from '@/types'
import { reactive } from 'vue'
const apiClient = apiService.getClient()

const getBySlugUrl = async (slugText: string): Promise<Wishlist> => {
  const { data } = await apiClient.get(`/wishlist/${slugText}`)
  return data
}

const updateItem = async (item: WishlistItem): Promise<void> => {
  await apiClient.put(`/wishlist/${item.wishlistId}/item/${item.id}`, item)
}

export const useWishlistStore = async (slugText: string) => {
  const list = reactive(await getBySlugUrl(slugText))
  return reactive({
    list,
    updateItem,
  })
}
