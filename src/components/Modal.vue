<script lang="ts" setup>
import BaseButton from './BaseButton.vue'
import { useModal } from '@/composables'

const modal = useModal()
</script>

<template>
  <div
    v-if="modal.isShown"
    data-test="modal"
    class="fixed z-10 inset-0 overflow-y-auto"
    role="dialog"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div class="fixed inset-0 bg-gray-500/75 transition-opacity"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen"
        >&#8203;</span
      >
      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3
                class="text-lg leading-6 font-medium text-gray-900"
                data-test="modal-title"
              >
                {{ modal.title }}
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500" data-test="modal-body">
                  {{ modal.body }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 flex flex-row">
          <BaseButton
            class="w-full"
            @click="modal.confirm"
            data-test="modal-confirm-button"
            >{{ modal.confirmText }}</BaseButton
          >
          <BaseButton
            class="w-full ml-2"
            @click="modal.cancel"
            data-test="modal-cancel-button"
            >{{ modal.cancelText }}</BaseButton
          >
        </div>
      </div>
    </div>
  </div>
</template>
