<script lang="ts" setup>
defineProps<{
  icon?: any
}>()
</script>
<template>
  <button
    class="inline-flex w-fit flex-row items-center justify-center rounded-md border-2 border-stone-200 py-1 px-2 text-stone-500 hover:bg-stone-100 dark:border-stone-700 dark:text-white/70 dark:hover:bg-stone-700"
  >
    <component v-if="icon" :is="icon" class="mr-1 h-4 w-4" />
    <span>
      <slot />
    </span>
  </button>
</template>
