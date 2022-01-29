<script lang="ts" setup>
defineProps<{
  icon?: any
}>()
</script>
<template>
  <button
    class="border-2 border-stone-200 text-stone-500 hover:bg-stone-100 rounded-md py-1 px-2 flex-row items-center w-fit inline-flex justify-center"
  >
    <component v-if="icon" :is="icon" class="w-4 h-4 mr-1" />
    <span>
      <slot />
    </span>
  </button>
</template>
