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
      class="text-background absolute top-0 inset-x-0 h-40 flex justify-center items-center text-md text-white text-center font-bold"
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
