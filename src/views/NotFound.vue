<template>
  <h1>{{ t('errors.not-found.text') }}</h1>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
