<script setup lang="ts">
import Tile from '@/components/Tile.vue'
import { IconSpinner, IconError } from '@/components/icons'
import { useWishlistsStore } from '@/composables'
const { lists, isLoading, hasError } = useWishlistsStore()
</script>

<template>
  <h1 class="text-3xl text-center">Wunschlisten</h1>
  <div
    v-if="isLoading"
    class="flex flex-row space-x-2 items-center content-center justify-center m-20"
  >
    <IconSpinner class="w-4 h-4" />
    <span> Lade Wunschlisten... </span>
  </div>
  <div
    v-else-if="hasError"
    class="flex flex-row space-x-2 items-center content-center justify-center m-20 text-red-500"
  >
    <IconError class="w-4 - h-4" />
    <span> Es ist ein Fehler aufgetreten... </span>
  </div>
  <div v-else class="flex flex-row flex-wrap justify-around p-10">
    <router-link
      v-for="(item, index) in lists"
      :key="index"
      :to="'/' + item.slugUrlText"
    >
      <Tile
        :title="item.title"
        :image-src="item.imageSrc"
        class="m-2 hover:ring-2 ring-slate-500"
      />
    </router-link>
  </div>
</template>
