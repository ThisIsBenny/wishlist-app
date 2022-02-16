<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import ImagePreview from './ImagePreview.vue'
import { ButtonBase } from './'
import IconDelete from './icons/IconDelete.vue'
import { WishlistItem } from '@/types'
defineProps<{
  item: WishlistItem
}>()
const { t } = useI18n()

const emits = defineEmits(['delete'])
</script>

<template>
  <div
    class="flex h-fit flex-col space-x-0 overflow-hidden rounded-md border-2 border-stone-200 dark:border-stone-700 sm:h-40 sm:flex-row sm:space-x-2"
  >
    <ImagePreview
      class="max-h-44 flex-shrink-0 flex-grow-0 object-cover sm:aspect-[3/2]"
      :src="item.imageSrc"
      :alt="item.title"
    />

    <div class="flex w-full flex-col justify-between p-2">
      <span></span>
      <ButtonBase
        class="h-12 w-full"
        mode="danger"
        @click.prevent="() => emits('delete')"
        :icon="IconDelete"
        >{{ t('components.wishlist-item.delete-button.text') }}</ButtonBase
      >
    </div>
  </div>
</template>
