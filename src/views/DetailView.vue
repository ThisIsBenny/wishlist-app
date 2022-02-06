<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { WishlistItem as WishlistItemType } from '@/types'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useWishlistStore, useModal } from '@/composables'
import Tile from '@/components/Tile.vue'
import WishlistItem from '@/components/WishlistItem.vue'

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
  <div v-if="list !== null">
    <div
      class="flex flex-col md:flex-row space-x-0 md:space-x-6 space-y-2 md:space-y-0 items-center"
    >
      <Tile :image-src="list.imageSrc" class="shrink-0"></Tile>
      <div>
        <h1 class="text-2xl font-bold text-center md:text-left mb-2">
          {{ list.title }}
        </h1>
        <p v-if="list.description" class="text-lg">
          {{ list.description }}
        </p>
      </div>
    </div>
    <div class="flex flex-col space-y-14 md:space-y-8 my-10">
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
  </div>
</template>
