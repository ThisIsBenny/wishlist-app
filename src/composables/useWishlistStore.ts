import useAxios, { CustomAxiosError } from '@/composables/useAxios'
import { Wishlist, WishlistItem } from '@/types'
import { ref } from 'vue'
const { client } = useAxios()

//@ts-expect-error ...
const state = ref<Wishlist>({})
const isReady = ref(false)

const fetch = async (slugText: string): Promise<void> => {
  try {
    const { data } = await client.get(`/wishlist/${slugText}`)
    state.value = data
    isReady.value = true
  } catch (e: any) {
    if (e.isAxiosError && !(<CustomAxiosError>e.ignore)) {
      throw e
    }
  }
}

const update = async (updatedData: Wishlist): Promise<void> => {
  const id = state.value?.id
  const payload = {
    ...state.value,
    ...updatedData,
  }
  try {
    const { data } = await client.put(`/wishlist/${id}`, payload)
    state.value = {
      ...state.value,
      ...data,
    }
  } catch (e: any) {
    if (e.isAxiosError && !(<CustomAxiosError>e.ignore)) {
      throw e
    }
  }
}

const itemBought = async (item: WishlistItem): Promise<void> => {
  await client.post(`/wishlist/${item.wishlistId}/item/${item.id}/bought`)
  item.bought = true
}

export const useWishlistStore = () => {
  return {
    state,
    isReady,
    fetch,
    update,
    itemBought,
  }
}
