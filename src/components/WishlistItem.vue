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
  comment?: string
}>()
const { t } = useI18n()
</script>

<template>
  <div
    class="h-fit sm:h-40 flex flex-col sm:flex-row space-x-0 sm:space-x-2 rounded-md border-stone-200 border-2 overflow-hidden"
  >
    <img
      v-if="image"
      :src="image"
      :alt="title"
      class="object-cover sm:aspect-[3/2] max-h-44 flex-shrink-0 flex-grow-0"
    />
    <div
      v-else
      class="sm:aspect-[3/2] max-h-44 flex-shrink-0 flex-grow-0 bg-stone-100 flex justify-center items-center"
    >
      <IconImagePlaceholder class="h-36 w-36 opacity-20" />
    </div>

    <div class="flex flex-col p-2 justify-between">
      <div>
        <h1 class="text-lg mb-1 font-bold">{{ title }}</h1>
        <p class="text-sm">{{ description }}</p>
        <a
          v-if="url"
          :href="url"
          target="_blank"
          rel="noopener"
          class="text-sm mt-1 text-stone-500 flex flex-row items-center w-fit"
        >
          <IconLink class="mr-1 w-4 h-4" />
          <span>{{
            t('components.wishlist-item.external-product-page-link.text')
          }}</span>
        </a>
      </div>
      <BaseButton
        class="mt-4 sm:mt-2 text-xs"
        :icon="IconCart"
        @click="$emit('bought')"
        >{{ t('components.wishlist-item.bought-button.text') }}</BaseButton
      >
    </div>
  </div>
</template>
