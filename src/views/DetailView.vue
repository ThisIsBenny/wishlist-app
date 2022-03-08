<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Wishlist, WishlistItem as WishlistItemType } from '@/types'
import { useRoute, useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { useWishlistStore, useModal, useEditMode } from '@/composables'
import { useToast } from 'vue-toastification'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()
const modal = useModal()
const { t } = useI18n()
const toast = useToast()
const { isActive: editModeIsActive } = useEditMode()
const {
  fetch,
  state,
  error,
  isFinished,
  updateWishlist,
  deleteWishlist,
  createItem,
  updateItem,
  itemBought,
  itemDelete,
  filteredItems,
} = useWishlistStore()
await fetch(route.params.slug as string)

const title = computed(() => {
  return state.value?.title
    ? t('common.title.text', { title: state.value.title })
    : t('common.loading.text')
})

useTitle(title)

const handleUpdateWishlist = async (wishlist: Wishlist): Promise<void> => {
  try {
    await updateWishlist(wishlist)
    toast.success(t('common.saved.text'))
    router.push(`/${wishlist.slugUrlText}`)
  } catch (error) {
    toast.error(t('common.saving-failed.text'))
  }
}

const handleDelete = async (): Promise<void> => {
  const confirmed = await modal.show(
    t('pages.detail-view.modal-delete-wishlist.title.text'),
    t('pages.detail-view.modal-delete-wishlist.confirm-button.text'),
    t('pages.detail-view.modal-delete-wishlist.cancel-button.text')
  )
  if (confirmed) {
    try {
      await deleteWishlist()
      toast.success(t('common.deleted.text'))
      router.push('/')
    } catch (error) {
      toast.error(t('common.deleting-failed.text'))
    }
  }
}

const handleCreateItem = async (values: WishlistItemType): Promise<void> => {
  try {
    await createItem(values)
    toast.success(t('common.saved.text'))
  } catch (error) {
    toast.error(t('common.saving-failed.text'))
  }
}

const handleUpdateItem = async (
  currentValues: WishlistItemType,
  newValues: WishlistItemType
): Promise<void> => {
  try {
    await updateItem(currentValues, newValues)
    toast.success(t('common.saved.text'))
  } catch (error) {
    toast.error(t('common.saving-failed.text'))
  }
}

const handleBought = async (item: WishlistItemType): Promise<void> => {
  const confirmed = await modal.show(
    t('pages.detail-view.modal-bought-item.title.text'),
    t('pages.detail-view.modal-bought-item.confirm-button.text'),
    t('pages.detail-view.modal-bought-item.cancel-button.text'),
    t('pages.detail-view.modal-bought-item.body.text')
  )
  if (confirmed) {
    itemBought(item)
  }
}
const handleDeleteItem = async (item: WishlistItemType): Promise<void> => {
  const confirmed = await modal.show(
    t('pages.detail-view.modal-delete-item.title.text'),
    t('pages.detail-view.modal-delete-item.confirm-button.text'),
    t('pages.detail-view.modal-delete-item.cancel-button.text')
  )
  if (confirmed) {
    try {
      await itemDelete(item)
      toast.success(t('common.deleted.text'))
    } catch (error) {
      toast.error(t('common.deleting-failed.text'))
    }
  }
}
</script>

<template>
  <div v-if="isFinished && !error && state" class="h-full">
    <div
      class="flex flex-col items-center space-x-0 space-y-2 md:flex-row md:space-x-6 md:space-y-0"
    >
      <ImageTile :image-src="state.imageSrc" class="shrink-0"></ImageTile>
      <div v-if="!editModeIsActive">
        <h1 class="mb-2 text-center text-2xl font-bold md:text-left">
          {{ state.title }}
        </h1>
        <p class="text-lg">
          {{ state.description }}
        </p>
      </div>
      <FormWishlist
        v-else
        :wishlist="state"
        @update="handleUpdateWishlist"
        @delete="handleDelete"
      />
    </div>

    <div
      v-if="!editModeIsActive && filteredItems.length === 0"
      class="flex h-1/2 w-full justify-center"
    >
      <div
        class="flex flex-col flex-wrap items-center justify-center text-center text-xl text-gray-600/75 dark:text-white/70 sm:flex-row sm:space-x-2 sm:text-left"
      >
        <IconNoGift class="h-10 w-10 fill-gray-600/75 dark:fill-white/70" />
        <span>{{ t('pages.detail-view.main.empty-list.text') }}</span>
      </div>
    </div>

    <div
      v-else
      class="flex flex-col py-10"
      :class="{
        'divide-y-2': editModeIsActive,
        'space-y-14 md:space-y-8': !editModeIsActive,
      }"
    >
      <FormWishlistItem
        v-if="editModeIsActive"
        @create="handleCreateItem"
        class="py-8 md:py-14"
      />
      <div
        v-for="item in filteredItems"
        :key="item.id"
        :class="{
          'py-8 md:py-14': editModeIsActive,
        }"
      >
        <WishlistItem
          v-if="!editModeIsActive"
          :item="item"
          @bought="handleBought(item)"
        />
        <FormWishlistItem
          v-else
          :item="item"
          @update="(updateValues) => handleUpdateItem(item, updateValues)"
          @delete="handleDeleteItem(item)"
        />
      </div>
    </div>
  </div>
</template>
