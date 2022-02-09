<template>
  <header
    class="mb-2 flex flex-row items-center justify-end space-x-2 opacity-60"
  >
    <div @click="() => toggleDark()">
      <IconLightDark class="h-6 w-6 cursor-pointer" />
    </div>
    <!-- <div><IconMenu class="h-8 w-8 cursor-pointer"></IconMenu></div> -->
  </header>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { IconLightDark, IconMenu } from '@/components/icons'

const toggleDark = useToggle(useDark())
</script>
