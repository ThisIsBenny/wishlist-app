<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import IconLink from './icons/IconLink.vue'
import IconImagePlaceholder from './icons/IconImagePlaceholder.vue'
import BaseButton from './BaseButton.vue'
import IconCart from './icons/IconCart.vue'
defineProps<{
  title: string
  image: string
  url?: string
  description: string
}>()
const { t } = useI18n()
</script>

<template>
  <div
    class="flex h-fit flex-col space-x-0 overflow-hidden rounded-md border-2 border-stone-200 dark:border-stone-700 sm:h-40 sm:flex-row sm:space-x-2"
  >
    <img
      v-if="image"
      :src="image"
      :alt="title"
      class="max-h-44 flex-shrink-0 flex-grow-0 object-cover sm:aspect-[3/2]"
    />
    <div
      v-else
      class="flex max-h-44 flex-shrink-0 flex-grow-0 items-center justify-center bg-stone-100 sm:aspect-[3/2]"
    >
      <IconImagePlaceholder class="h-36 w-36 opacity-20" />
    </div>

    <div class="flex flex-col justify-between p-2">
      <div>
        <h1 class="mb-1 text-lg font-bold">{{ title }}</h1>
        <p class="text-sm sm:line-clamp-3">
          {{ description }}
        </p>
      </div>
      <div class="flex flex-row items-baseline space-x-2">
        <BaseButton
          class="mt-4 text-xs sm:mt-2"
          :icon="IconCart"
          @click="$emit('bought')"
          >{{ t('components.wishlist-item.bought-button.text') }}</BaseButton
        >
        <a
          v-if="url"
          :href="url"
          target="_blank"
          rel="noopener"
          class="mt-1 flex w-fit flex-row items-center text-sm text-stone-500 dark:text-white/60"
        >
          <IconLink class="mr-1 h-4 w-4" />
          <span>{{
            t('components.wishlist-item.external-product-page-link.text')
          }}</span>
        </a>
      </div>
    </div>
  </div>
</template>
