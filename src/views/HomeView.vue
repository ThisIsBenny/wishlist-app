<script setup lang="ts">
import Tile from '@/components/Tile.vue'
import { useWishlistsStore } from '@/composables'
const wishlistStore = await useWishlistsStore()
const lists = wishlistStore.lists
</script>

<template>
  <h1 class="text-3xl text-center">Wunschlisten</h1>
  <div class="flex flex-row flex-wrap justify-around p-10">
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
