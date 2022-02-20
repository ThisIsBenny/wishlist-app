<script setup lang="ts">
defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <img v-if="src" :src="src" :alt="alt" class="object-cover" />
  <div v-else class="flex items-center justify-center bg-stone-100">
    <IconImagePlaceholder class="h-36 w-36 fill-stone-300" />
  </div>
</template>
