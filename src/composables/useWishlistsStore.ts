import { Wishlist } from '@/types'
import { Ref } from 'vue'
import { useFetch } from './useFetch'

const { isFinished, error, data } = useFetch('/wishlist').json()

export const useWishlistsStore = () => {
  return {
    state: data as Ref<Wishlist[]>,
    error,
    isFinished,
  }
}
