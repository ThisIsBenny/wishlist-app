import useAxios from '@/composables/useAxios'
import { Wishlist } from '@/types'
import { ref } from 'vue'
const { client } = useAxios()
const prefix = '/wishlist'

const refState = ref<Wishlist[]>([])

export const fetch = async (): Promise<void> => {
  const { data } = await client.get(prefix)
  refState.value = data
}

export const useWishlistsStore = () => {
  return {
    lists: refState,
    fetch,
  }
}
