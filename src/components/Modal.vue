<script lang="ts" setup>
import { useModal } from '@/composables'

const modal = useModal()
</script>

<template>
  <div
    v-if="modal.isShown"
    data-test="modal"
    class="fixed inset-0 z-10 overflow-y-auto"
    role="dialog"
  >
    <div
      class="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 bg-stone-700/75 transition-opacity"></div>

      <span class="hidden sm:inline-block sm:h-screen sm:align-middle"
        >&#8203;</span
      >
      <div
        class="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all dark:bg-stone-900 sm:my-8 sm:w-full sm:max-w-lg sm:align-middle"
      >
        <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg font-medium leading-6" data-test="modal-title">
                {{ modal.title }}
              </h3>
              <div class="mt-2">
                <p class="text-sm opacity-60" data-test="modal-body">
                  {{ modal.body }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-row px-4 py-3 sm:px-6">
          <ButtonBase
            class="w-full"
            @click="modal.confirm"
            data-test="modal-confirm-button"
            >{{ modal.confirmText }}</ButtonBase
          >
          <ButtonBase
            class="ml-2 w-full"
            @click="modal.cancel"
            data-test="modal-cancel-button"
            >{{ modal.cancelText }}</ButtonBase
          >
        </div>
      </div>
    </div>
  </div>
</template>
