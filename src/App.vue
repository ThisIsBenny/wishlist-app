<template>
  <div class="app max-w-[900px] mx-auto p-10">
    <main>
      <router-view v-slot="{ Component }">
        <template v-if="Component">
          <keep-alive>
            <div
              v-if="error"
              class="flex flex-row space-x-2 items-center content-center justify-center m-20 text-red-500"
            >
              <IconError class="w-4 h-4" />
              <span>Es ist ein Fehler aufgetreten...</span>
            </div>
            <suspense v-else>
              <template #default>
                <component :is="Component"></component>
              </template>
              <template #fallback>
                <div
                  class="flex flex-row space-x-2 items-center content-center justify-center m-20"
                >
                  <IconSpinner class="w-4 h-4" />
                  <span> Lade... </span>
                </div>
              </template>
            </suspense>
          </keep-alive>
        </template>
      </router-view>
    </main>
    <modal-overlay />
  </div>
</template>
<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'
import { IconSpinner, IconError } from '@/components/icons'

const error = ref(null)

onErrorCaptured((e: any) => {
  error.value = e
  return false
})
</script>
