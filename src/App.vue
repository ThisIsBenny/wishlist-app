<template>
  <div class="app max-w-[900px] mx-auto p-10">
    <main>
      <router-view v-slot="{ Component }">
        <template v-if="Component">
          <keep-alive>
            <suspense>
              <component :is="Component"></component>
              <template #fallback>
                <div
                  class="flex flex-row space-x-2 items-center content-center justify-center m-20"
                >
                  <IconSpinner class="w-4 h-4" />
                  <span> Lade Daten... </span>
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
import IconSpinner from '@/components/icons/IconSpinner.vue'
</script>
