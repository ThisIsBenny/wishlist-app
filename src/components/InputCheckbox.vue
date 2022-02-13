<template>
  <div class="relative mb-8">
    <label class="mb-1 block w-full" :for="name">{{ label }}</label>
    <div @click="handleChange(checked)">
      <IconToggleOn v-if="!checked" class="h-12 w-12 fill-emerald-700" />
      <IconToggleOff v-else class="h-12 w-12 cursor-pointer fill-stone-500" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import { IconToggleOn, IconToggleOff } from '@/components/icons'

const props = defineProps({
  value: {
    type: Boolean,
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
})
const { checked, handleChange } = useField(props.name, undefined, {
  type: 'checkbox',
  checkedValue: props.value,
  initialValue: props.value,
})
</script>
