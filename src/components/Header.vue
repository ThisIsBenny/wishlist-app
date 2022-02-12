<template>
  <header
    class="mb-2 flex flex-row items-center justify-end space-x-2 opacity-60"
  >
    <div @click="() => toggleDark()">
      <IconLightDark class="h-6 w-6 cursor-pointer" />
    </div>
    <div v-if="isAuthenticated" @click="() => setToken('')">
      <IconLogout class="h-6 w-6 cursor-pointer"></IconLogout>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { IconLightDark, IconLogout } from '@/components/icons'
import { useAuth } from '@/composables/'

const { isAuthenticated, setToken } = useAuth()

const toggleDark = useToggle(useDark())
</script>
