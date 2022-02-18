<template>
  <div class="relative mb-8">
    <label class="mb-1 block w-full" :for="name">{{ label }}</label>
    <div @click="handleChange(!checked)">
      <IconToggleOn v-if="checked" class="h-12 w-12 fill-emerald-700" />
      <IconToggleOff
        v-else
        class="h-12 w-12 cursor-pointer fill-stone-500 dark:fill-current"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'

const props = defineProps({
  value: {
    type: Boolean,
    default: false,
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
  initialValue: props.value,
  checkedValue: true,
  uncheckedValue: false,
})
</script>
