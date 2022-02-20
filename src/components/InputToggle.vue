<template>
  <div class="relative mb-8">
    <label class="flex cursor-pointer items-center">
      <input
        v-bind="$attrs"
        type="checkbox"
        :checked="checked"
        class="input sr-only"
        @change="handleChange(!checked)"
      />
      <span class="switch"></span>
      <span class="ml-3">{{ label }}</span>
    </label>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

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

<style scoped lang="postcss">
.switch {
  --switch-container-width: 50px;
  --switch-size: calc(var(--switch-container-width) / 2);

  display: flex;
  align-items: center;
  position: relative;
  height: var(--switch-size);
  flex-basis: var(--switch-container-width);
  border-radius: var(--switch-size);
  transition: background-color 0.25s ease-in-out;
  @apply bg-stone-500;
}

.switch::before {
  content: '';
  position: absolute;
  left: 1px;
  height: calc(var(--switch-size) - 4px);
  width: calc(var(--switch-size) - 4px);
  border-radius: 9999px;
  @apply bg-white;
  transition: 0.375s transform ease-in-out;
}

.input:checked + .switch {
  @apply bg-emerald-500;
}

.input:checked + .switch::before {
  @apply border-emerald-500;
  transform: translateX(
    calc(var(--switch-container-width) - var(--switch-size))
  );
}
</style>
