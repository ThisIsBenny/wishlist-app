import { Wishlist } from '@/types'
import { syncRef } from '@vueuse/core'
import { ref } from 'vue'
import { useFetch } from './useFetch'

const state = ref<Wishlist[]>([])

export const useWishlistsStore = () => {
  const { isFinished, error, data } = useFetch('/wishlist').json()
  syncRef(data, state)

  return {
    state,
    error,
    isFinished,
  }
}
