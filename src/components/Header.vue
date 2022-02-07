<template>
  <header class="py-4 flex flex-row-reverse opacity-60">
    <div @click="toggleMode"><IconLightDark class="h-6 w-6" /></div>
  </header>
</template>

<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { IconLightDark } from '@/components/icons'
const mode = useColorMode()

const toggleMode = () => {
  mode.value = mode.value === 'dark' ? 'light' : 'dark'
}
</script>
