<template>
  <div class="m-4 h-full">
    <Header />
    <main class="mx-auto h-full max-w-[900px]">
      <router-view v-slot="{ Component }">
        <template v-if="Component">
          <div
            v-if="error"
            class="m-20 flex flex-row content-center items-center justify-center space-x-2 text-red-500"
          >
            <IconError class="h-4 w-4 fill-red-500" />
            <span>{{ t('errors.generic.text') }}</span>
          </div>
          <suspense v-else>
            <template #default>
              <component :is="Component"></component>
            </template>
            <template #fallback>
              <div
                class="m-20 flex flex-row content-center items-center justify-center space-x-2"
              >
                <IconSpinner class="h-4 w-4" />
                <span> {{ t('common.loading.text') }} </span>
              </div>
            </template>
          </suspense>
        </template>
      </router-view>
    </main>
    <modal-overlay />
  </div>
</template>
<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { onErrorCaptured, ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

useTitle(t('common.app-title.text'))

const error = ref()

onErrorCaptured((e: unknown) => {
  console.error(e)
  error.value = e
  return false
})
</script>
