import { useAuth } from './useAuth'
import { ref, readonly, computed } from 'vue'

const { isAuthenticated } = useAuth()
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

const isActive = computed(() => state.value && isAuthenticated.value)

export const useEditMode = () => {
  return {
    state: readonly(state),
    isActive,
    activate,
    deactivate,
    toggle,
  }
}
