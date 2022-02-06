import useAxios from '@/composables/useAxios'
import { Wishlist, WishlistItem } from '@/types'
import { AxiosError } from 'axios'
import { ref } from 'vue'
const { client } = useAxios()

const list = ref<Wishlist | null>(null)

const fetch = async (slugText: string): Promise<void> => {
  try {
    const { data } = await client.get(`/wishlist/${slugText}`)
    list.value = data
  } catch (e: any) {
    if (e.isAxiosError && !(<AxiosError>e.ignore)) {
      throw e
    }
  }
}

const updateItem = async (item: WishlistItem): Promise<void> => {
  await client.put(`/wishlist/${item.wishlistId}/item/${item.id}`, item)
}

export const useWishlistStore = () => {
  return {
    list,
    fetch,
    updateItem,
  }
}
