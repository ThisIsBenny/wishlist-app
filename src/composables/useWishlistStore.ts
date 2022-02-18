import { computed, ref } from 'vue'
import useAxios, { CustomAxiosError } from '@/composables/useAxios'
import { Wishlist, WishlistItem } from '@/types'
import { useEditMode } from './useEditMode'
const { client } = useAxios()
const { isActive: editModeIsActive } = useEditMode()

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

const createItem = async (values: WishlistItem): Promise<void> => {
  const id = state.value?.id
  const payload = {
    ...values,
  }
  try {
    const { data } = await client.post(`/wishlist/${id}/item`, payload)
    state.value?.items?.push(data)
  } catch (e: any) {
    if (e.isAxiosError && !(<CustomAxiosError>e.ignore)) {
      throw e
    }
  }
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
  try {
    const { data } = await client.put(
      `/wishlist/${id}/item/${currentValues.id}`,
      payload
    )
    state.value?.items?.splice(
      state.value.items.indexOf(currentValues),
      1,
      data
    )
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

const itemDelete = async (item: WishlistItem): Promise<void> => {
  await client.delete(`/wishlist/${item.wishlistId}/item/${item.id}`)
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
    state,
    isReady,
    fetch,
    update,
    createItem,
    updateItem,
    itemBought,
    itemDelete,
    filteredItems,
  }
}
