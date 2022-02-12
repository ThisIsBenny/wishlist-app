import { ref, readonly } from 'vue'

const state = ref(false)

const activate = (): void => {
  state.value = true
}

const deactivate = (): void => {
  state.value = false
}

const toggle = (): void => {
  state.value = !state.value
}

export const useEditMode = () => {
  return {
    editMode: readonly(state),
    activate,
    deactivate,
    toggle,
  }
}
