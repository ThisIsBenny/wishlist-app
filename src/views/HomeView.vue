<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useWishlistsStore, useEditMode } from '@/composables'

const { t } = useI18n()
const { isActive: editModeIsActive } = useEditMode()
const { state, isFinished, fetch } = useWishlistsStore()
await fetch()
</script>

<template>
  <h1 class="text-semibold text-center text-3xl">
    {{ t('common.app-title.text') }}
  </h1>
  <div
    v-if="!isFinished"
    class="m-20 flex flex-row content-center items-center justify-center space-x-2"
  >
    <IconSpinner class="h-4 w-4" />
    <span> {{ t('common.loading.text') }} </span>
  </div>
  <div
    v-if="state.length === 0 && !editModeIsActive"
    class="flex h-1/2 w-full justify-center"
  >
    <div
      class="flex flex-col flex-wrap items-center justify-center text-center text-xl text-gray-600/75 dark:text-white/70 sm:flex-row sm:space-x-2 sm:text-left"
    >
      <span>{{ t('pages.home-view.main.empty-list.text') }}</span>
    </div>
  </div>
  <div v-else class="flex flex-row flex-wrap justify-around p-10">
    <router-link
      v-for="item in state"
      :key="item.id"
      :to="'/' + item.slugUrlText"
    >
      <ImageTile :title="item.title" :image-src="item.imageSrc" class="m-4" />
    </router-link>
    <router-link v-if="editModeIsActive" to="/create-wishlist">
      <CreateWishlistTile class="m-4" />
    </router-link>
  </div>
</template>
