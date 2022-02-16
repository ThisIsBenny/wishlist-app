<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { WishlistItem as WishlistItemType } from '@/types'
import { useRoute } from 'vue-router'
import { useWishlistStore, useModal, useEditMode } from '@/composables'
import {
  FormWishlist,
  ImageTile,
  WishlistItem,
  FormWishlistItem,
} from '@/components'
import { IconNoGift } from '../components/icons'

const route = useRoute()
const modal = useModal()
const { t } = useI18n()
const { isActive: editModeIsActive } = useEditMode()

const { state, fetch, isReady, itemBought, itemDelete, filteredItems } =
  useWishlistStore()
await fetch(route.params.slug as string)

const bought = async (item: WishlistItemType): Promise<void> => {
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
const deleteItem = async (item: WishlistItemType): Promise<void> => {
  const confirmed = await modal.show(
    t('pages.detail-view.modal-delete-item.title.text'),
    t('pages.detail-view.modal-delete-item.confirm-button.text'),
    t('pages.detail-view.modal-delete-item.cancel-button.text')
  )
  if (confirmed) {
    itemDelete(item)
  }
}
</script>

<template>
  <div v-if="isReady" class="h-full">
    <div
      class="flex flex-col items-center space-x-0 space-y-2 md:flex-row md:space-x-6 md:space-y-0"
      v-if="state !== undefined"
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
      <FormWishlist v-else :wishlist="state" />
    </div>
    <div
      v-if="filteredItems.length > 0"
      class="flex flex-col space-y-14 py-10 md:space-y-8"
    >
      <div v-for="(item, index) in filteredItems" :key="index">
        <WishlistItem
          v-if="!editModeIsActive"
          :item="item"
          @bought="bought(item)"
        />
        <FormWishlistItem v-else :item="item" @delete="deleteItem(item)" />
      </div>
    </div>
    <div v-else class="flex h-1/2 w-full justify-center">
      <div
        class="flex flex-col flex-wrap items-center justify-center text-center text-xl text-gray-600/75 dark:text-white/70 sm:flex-row sm:space-x-2 sm:text-left"
      >
        <IconNoGift class="h-10 w-10 fill-gray-600/75 dark:fill-white/70" />

        <span>{{ t('pages.detail-view.main.empty-list.text') }}</span>
      </div>
    </div>
  </div>
</template>
