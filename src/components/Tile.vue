<script lang="ts" setup>
defineProps<{
  title?: string
  imageSrc: string
}>()
</script>

<template>
  <div class="relative h-40 w-40 overflow-hidden rounded-full">
    <img :src="imageSrc" class="h-full w-full object-cover" :alt="title" />
    <div
      v-if="title"
      class="text-background text-md absolute inset-x-0 top-0 flex h-40 items-center justify-center text-center font-bold text-white dark:text-white/75"
    >
      {{ title }}
    </div>
  </div>
</template>
<style scoped>
.text-background {
  background: linear-gradient(0deg, #00000088 30%, #ffffff44 100%);
}
</style>
