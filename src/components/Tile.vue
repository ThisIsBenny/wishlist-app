<script lang="ts" setup>
defineProps<{
  title?: string
  imageSrc: string
}>()
</script>

<template>
  <div class="relative w-40 h-40 rounded-full overflow-hidden">
    <img :src="imageSrc" class="object-cover w-full h-full" :alt="title" />
    <div
      v-if="title"
      class="absolute w-full py-2.5 bottom-0 inset-x-0 bg-white opacity-60 text-sm font-bold text-center leading-4"
    >
      {{ title }}
    </div>
  </div>
</template>
