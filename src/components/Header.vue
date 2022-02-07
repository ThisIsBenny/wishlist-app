<template>
  <header
    class="flex flex-row justify-end items-center opacity-60 mb-2 space-x-2"
  >
    <div @click="toggleMode">
      <IconLightDark class="h-6 w-6 cursor-pointer" />
    </div>
    <!-- <div><IconMenu class="h-8 w-8 cursor-pointer"></IconMenu></div> -->
  </header>
</template>

<script setup lang="ts">
import { useColorMode } from '@vueuse/core'
import { IconLightDark, IconMenu } from '@/components/icons'
const mode = useColorMode()

const toggleMode = () => {
  mode.value = mode.value === 'dark' ? 'light' : 'dark'
}
</script>
