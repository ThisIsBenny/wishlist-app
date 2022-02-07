<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Tile from '@/components/Tile.vue'
import { useWishlistsStore } from '@/composables'

const { t } = useI18n()
const { lists, fetch } = useWishlistsStore()
await fetch()
</script>

<template>
  <h1 class="text-3xl text-center">{{ t('common.app-title.text') }}</h1>
  <div v-if="lists" class="flex flex-row flex-wrap justify-around p-10">
    <router-link
      v-for="(item, index) in lists"
      :key="index"
      :to="'/' + item.slugUrlText"
    >
      <Tile
        :title="item.title"
        :image-src="item.imageSrc"
        class="m-4 hover:ring-2 ring-slate-500"
      />
    </router-link>
  </div>
</template>
