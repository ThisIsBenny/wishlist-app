import { computed, ref, unref } from 'vue'
import { Wishlist, WishlistItem } from '@/types'
import { useEditMode } from './useEditMode'
const { isActive: editModeIsActive } = useEditMode()
import { useFetch } from './useFetch'

const state = ref<Wishlist>()
const isFinished = ref<boolean>(false)
const error = ref<any>()

const fetch = async (slugText: string) => {
  const request = await useFetch(`/wishlist/${slugText}`).json()
  state.value = request.data.value
  isFinished.value = request.isFinished.value
  error.value = request.error.value
}

const createWishlist = async (wishlist: Wishlist): Promise<void> => {
  const { data, error } = await useFetch('/wishlist/')
    .post(unref(wishlist))
    .json()
  if (error.value) {
    throw error.value
  }
  state.value = <Wishlist>data.value
}
const updateWishlist = async (updatedData: Wishlist): Promise<void> => {
  const id = state.value?.id
  const payload = {
    ...state.value,
    ...updatedData,
  }
  const { data, error } = await useFetch(`/wishlist/${id}`).put(payload).json()
  if (error.value) {
    throw error.value
  }
  state.value = {
    ...state.value,
    ...(<Wishlist>data.value),
  }
}

const deleteWishlist = async (): Promise<void> => {
  const { error } = await useFetch(`/wishlist/${state!.value!.id}`).delete()
  if (error.value) {
    throw error.value
  }
}

const createItem = async (values: WishlistItem): Promise<void> => {
  const id = state.value?.id
  const payload = {
    ...values,
  }
  const { data, error } = await useFetch(`/wishlist/${id}/item`)
    .post(payload)
    .json()
  if (error.value) {
    throw error.value
  }
  state.value?.items?.push(unref(data))
}

const updateItem = async (
  currentValues: WishlistItem,
  newValues: WishlistItem
): Promise<void> => {
  const id = state.value?.id
  const payload = {
    ...currentValues,
    ...newValues,
  }

  const { data, error } = await useFetch(
    `/wishlist/${id}/item/${currentValues.id}`
  )
    .put(payload)
    .json()
  if (error.value) {
    throw error.value
  }
  state.value?.items?.splice(
    state.value.items.indexOf(currentValues),
    1,
    unref(data)
  )
}

const itemBought = async (item: WishlistItem): Promise<void> => {
  const { error } = await useFetch(
    `/wishlist/${item.wishlistId}/item/${item.id}/bought`
  ).post()
  if (error.value) {
    throw error.value
  }
  item.bought = true
}

const itemDelete = async (item: WishlistItem): Promise<void> => {
  const { error } = await useFetch(
    `/wishlist/${item.wishlistId}/item/${item.id}`
  ).delete()
  if (error.value) {
    throw error.value
  }
  state.value?.items?.splice(state.value.items.indexOf(item), 1)
}

const filteredItems = computed(() => {
  if (!state.value || !state.value.items) {
    return []
  } else if (editModeIsActive.value) {
    return state.value.items
  }
  return state.value.items.filter((item: WishlistItem) => item.bought === false)
})

export const useWishlistStore = () => {
  return {
    fetch,
    state,
    isFinished,
    error,
    createWishlist,
    updateWishlist,
    deleteWishlist,
    createItem,
    updateItem,
    itemBought,
    itemDelete,
    filteredItems,
  }
}
