<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <div class="relative h-40 w-40 overflow-hidden rounded-full bg-stone-400">
    <div
      class="text-md font-semi-bold absolute inset-x-0 top-0 flex h-40 items-center justify-center space-x-2 p-6 text-center text-white dark:text-white/75"
    >
      <IconCreation class="h-6 w-6 shrink-0 fill-white dark:fill-white/75" />
      <span class="text-left"
        >{{ t('components.create-wishlist-title.text') }}
      </span>
    </div>
  </div>
</template>
<style scoped></style>
