<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Tile from '@/components/Tile.vue'
import { useWishlistsStore } from '@/composables'

const { t } = useI18n()
const { state: wishlists, fetch } = useWishlistsStore()
await fetch()
</script>

<template>
  <h1 class="text-semibold text-center text-3xl">
    {{ t('common.app-title.text') }}
  </h1>
  <div v-if="wishlists" class="flex flex-row flex-wrap justify-around p-10">
    <router-link
      v-for="(item, index) in wishlists"
      :key="index"
      :to="'/' + item.slugUrlText"
    >
      <Tile :title="item.title" :image-src="item.imageSrc" class="m-4" />
    </router-link>
  </div>
</template>
