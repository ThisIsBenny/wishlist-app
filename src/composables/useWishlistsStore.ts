import { Wishlist } from '@/types'
import { ref } from 'vue'
import { useFetch } from './useFetch'

const state = ref<Wishlist[]>([])
const isFinished = ref<boolean>(false)
const error = ref<any>()

const fetch = async () => {
  const request = await useFetch('/wishlist').json()
  state.value = request.data.value
  isFinished.value = request.isFinished.value
  error.value = request.error.value
}

export const useWishlistsStore = () => {
  return {
    fetch,
    state,
    error,
    isFinished,
  }
}
