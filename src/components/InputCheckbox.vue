<template>
  <div class="relative mb-8">
    <label class="mb-1 block w-full" :for="name">{{ label }}</label>
    <input
      class="border-2 border-solid border-stone-300 bg-transparent px-2 outline-none dark:border-stone-700"
      :name="name"
      :id="name"
      type="checkbox"
      :checked="checked"
      @change="handleChange((checked = !checked))"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'

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
