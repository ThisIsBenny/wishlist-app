<template>
  <header
    class="mb-4 flex flex-row items-center space-x-2 opacity-60 sm:justify-end"
  >
    <div
      v-if="isAuthenticated"
      class="mr-4 inline-flex grow cursor-pointer items-center space-x-1"
      @click="() => toggle()"
    >
      <IconToggleOn v-if="editMode" class="h-6 w-6 fill-emerald-700" />
      <IconToggleOff v-else class="h-6 w-6 cursor-pointer fill-current" />
      <span>{{ t('components.header.edit-mode.text') }}</span>
    </div>
    <router-link to="/">
      <IconHome class="h-6 w-6 cursor-pointer fill-current"></IconHome>
    </router-link>
    <div @click="() => toggleDark()">
      <IconLightDark class="h-6 w-6 cursor-pointer fill-current" />
    </div>
    <div v-if="isAuthenticated" @click="() => setToken('')">
      <IconLogout class="h-6 w-6 cursor-pointer fill-current"></IconLogout>
    </div>
    <router-link to="/login" v-else>
      <IconLogin class="h-6 w-6 cursor-pointer fill-current"></IconLogin>
    </router-link>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDark, useToggle } from '@vueuse/core'
import { useAuth, useEditMode } from '@/composables'

const { t } = useI18n()
const { isAuthenticated, setToken } = useAuth()
const { state: editMode, toggle } = useEditMode()

const toggleDark = useToggle(useDark())
</script>
