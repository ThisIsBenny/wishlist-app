<template>
  <header
    class="mb-4 flex flex-row items-center justify-end space-x-2 opacity-60"
  >
    <div
      v-if="isAuthenticated"
      class="mr-4 inline-flex cursor-pointer items-center space-x-1"
      @click="() => toggle()"
    >
      <IconToggleOn v-if="editMode" class="h-6 w-6 fill-emerald-700" />
      <IconToggleOff v-else class="h-6 w-6 cursor-pointer" />
      <span>{{ t('components.header.edit-mode.text') }}</span>
    </div>
    <div @click="() => toggleDark()">
      <IconLightDark class="h-6 w-6 cursor-pointer" />
    </div>
    <div v-if="isAuthenticated" @click="() => setToken('')">
      <IconLogout class="h-6 w-6 cursor-pointer"></IconLogout>
    </div>
    <router-link to="/login" v-else>
      <IconLogin class="h-6 w-6 cursor-pointer"></IconLogin>
    </router-link>
  </header>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDark, useToggle } from '@vueuse/core'
import {
  IconLightDark,
  IconLogout,
  IconLogin,
  IconToggleOn,
  IconToggleOff,
} from '@/components/icons'
import { useAuth, useEditMode } from '@/composables/'

const { t } = useI18n()
const { isAuthenticated, setToken } = useAuth()
const { editMode, toggle } = useEditMode()

const toggleDark = useToggle(useDark())
</script>
