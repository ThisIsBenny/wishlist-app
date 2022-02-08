<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { WishlistItem as WishlistItemType } from '@/types'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useWishlistStore, useModal } from '@/composables'
import Tile from '@/components/Tile.vue'
import WishlistItem from '@/components/WishlistItem.vue'
import { IconNoGift } from '../components/icons'

const route = useRoute()
const modal = useModal()

const { t } = useI18n()

const { list, fetch, updateItem } = useWishlistStore()
await fetch(route.params.slug as string)

const notBoughtItems = computed(() => {
  return list.value?.items?.filter(
    (item: WishlistItemType) => item.bought === false
  )
})

const bought = async (item: WishlistItemType): Promise<void> => {
  const confirmed = await modal.show(
    t('pages.detail-view.confirmation-modal.title.text'),
    t('pages.detail-view.confirmation-modal.confirm-button.text'),
    t('pages.detail-view.confirmation-modal.cancel-button.text'),
    t('pages.detail-view.confirmation-modal.body.text')
  )
  if (confirmed) {
    item.bought = true
    updateItem(item)
  }
}
</script>

<template>
  <div v-if="list !== null" class="h-full">
    <div
      class="flex flex-col items-center space-x-0 space-y-2 md:flex-row md:space-x-6 md:space-y-0"
    >
      <Tile :image-src="list.imageSrc" class="shrink-0"></Tile>
      <div>
        <h1 class="mb-2 text-center text-2xl font-bold md:text-left">
          {{ list.title }}
        </h1>
        <p v-if="list.description" class="text-lg">
          {{ list.description }}
        </p>
      </div>
    </div>
    <div
      v-if="notBoughtItems && notBoughtItems.length > 0"
      class="flex flex-col space-y-14 py-10 md:space-y-8"
    >
      <WishlistItem
        v-for="(item, index) in notBoughtItems"
        :key="index"
        :title="item.title"
        :url="item.url"
        :image="item.imageSrc"
        :description="item.description"
        @bought="bought(item)"
      />
    </div>
    <div v-else class="flex h-1/2 w-full justify-center">
      <div
        class="flex flex-col flex-wrap items-center justify-center text-center text-xl text-gray-600/75 dark:text-white/70 sm:flex-row sm:space-x-2 sm:text-left"
      >
        <IconNoGift class="h-10 w-10" />
        <span>{{ t('pages.detail-view.main.empty-list.text') }}</span>
      </div>
    </div>
  </div>
</template>
