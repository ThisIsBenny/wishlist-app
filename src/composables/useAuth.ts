import { readonly } from 'vue'
import { useStorage } from '@vueuse/core'

const state = useStorage('auth-token', '')

const setToken = (token: string): void => {
  state.value = token
}

export default () => {
  return {
    setToken,
    token: readonly(state),
  }
}
