<template>
  <div
    class="mt-20 flex flex-wrap flex-col sm:flex-row items-center sm:space-x-2 justify-center text-center sm:text-left text-xl"
  >
    <IconCloudQuestion class="h-12 w-12" />
    <h1>{{ t('errors.not-found.text') }}</h1>
  </div>
</template>
<script setup lang="ts">
import { IconCloudQuestion } from '@/components/icons'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
