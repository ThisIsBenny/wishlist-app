import useAxios from '@/composables/useAxios'
import { Wishlist } from '@/types'
import { readonly, ref } from 'vue'
const { client } = useAxios()
const prefix = '/wishlist'

const state = ref<Wishlist[]>([])

export const fetch = async (): Promise<void> => {
  const { data } = await client.get(prefix)
  state.value = data
}

export const useWishlistsStore = () => {
  return {
    state: readonly(state),
    fetch,
  }
}
