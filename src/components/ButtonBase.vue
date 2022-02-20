<script lang="ts" setup>
defineProps({
  icon: {
    type: Object,
    default: null,
  },
  mode: {
    type: String,
    default: 'secondary',
  },
})
</script>
<template>
  <button
    class="inline-flex w-fit flex-row items-center justify-center rounded-md border-2 py-1 px-2 disabled:cursor-not-allowed disabled:opacity-60"
    :class="{
      'border-0 bg-cyan-600 text-white disabled:bg-cyan-600 disabled:hover:bg-cyan-600 dark:bg-cyan-600 dark:hover:bg-cyan-600 dark:disabled:hover:bg-cyan-600':
        mode === 'primary',
      'border-0 bg-rose-500 text-white disabled:bg-rose-500 disabled:hover:bg-rose-500 dark:bg-rose-500 dark:hover:bg-rose-500 dark:disabled:hover:bg-rose-500':
        mode === 'danger',
      'border-stone-200 text-stone-500 hover:bg-stone-100 disabled:hover:bg-white dark:border-stone-700 dark:text-white/70 dark:hover:bg-stone-700 disabled:hover:dark:bg-stone-900':
        mode === 'secondary',
    }"
  >
    <component
      v-if="icon"
      :is="icon"
      class="mr-1 h-4 w-4 fill-white"
      :class="{
        'fill-stone-500 dark:fill-white/70 ': mode === 'secondary',
      }"
    />
    <span>
      <slot />
    </span>
  </button>
</template>
