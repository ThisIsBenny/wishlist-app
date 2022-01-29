<script setup lang="ts">
import { WishlistItem as WishlistItemType } from '@/types'
import { useRoute } from 'vue-router'
import Tile from '@/components/Tile.vue'
import WishlistItem from '@/components/WishlistItem.vue'
import { useWishlistStore, useModal } from '@/composables'
import { computed } from 'vue'

const route = useRoute()
const modal = useModal()
const wishlistStore = await useWishlistStore(route.params.slug as string)
const list = wishlistStore.list
const notBoughtItems = computed(() => {
  return list.items.filter((item: WishlistItemType) => item.bought === false)
})

const bought = async (item: WishlistItemType): Promise<void> => {
  const confirmed = await modal.show(
    'Möchten Sie den Gegenstand von der Liste nehmen?',
    'Durch das das runternehmen von der Liste ist dieser Gegenstand nicht mehr andere sichtbar.'
  )
  if (confirmed) {
    item.bought = true
    wishlistStore.updateItem(item)
  }
}
</script>

<template>
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
      :image="item.image"
      :description="item.description"
      :comment="item.comment"
      @bought="bought(item)"
    />
  </div>
</template>
