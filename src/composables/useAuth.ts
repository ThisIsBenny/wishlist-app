import { computed, readonly } from 'vue'
import { useStorage } from '@vueuse/core'

const state = useStorage('auth-token', '')

const setToken = (token: string): void => {
  state.value = token
}

const isAuthenticated = computed(() => {
  return state.value !== ''
})

export const useAuth = () => {
  return {
    setToken,
    isAuthenticated,
    token: readonly(state),
  }
}
