import { ref, computed } from 'vue'
import { apiConfig } from '@/config'

interface OidcProvider {
  id: string
  name: string
}

interface AuthConfig {
  emailLoginEnabled: boolean
  emailRegisterEnabled: boolean
  oidcProviders: OidcProvider[]
}

const state = ref<AuthConfig>({
  emailLoginEnabled: true,
  emailRegisterEnabled: true,
  oidcProviders: [],
})
const loaded = ref(false)

async function fetchConfig(): Promise<void> {
  if (loaded.value) return
  try {
    const response = await fetch(`${apiConfig.baseURL}/auth/config`, {
      credentials: 'include',
    })
    if (response.ok) {
      state.value = await response.json()
    }
  } catch {
    // Silently fail - config defaults remain
  }
  loaded.value = true
}

export const useAuthConfig = () => {
  if (!loaded.value) {
    fetchConfig()
  }

  const emailLoginEnabled = computed(() => state.value.emailLoginEnabled)
  const emailRegisterEnabled = computed(() => state.value.emailRegisterEnabled)
  const oidcProviders = computed(() => state.value.oidcProviders)

  return {
    emailLoginEnabled,
    emailRegisterEnabled,
    oidcProviders,
    fetchConfig,
    loaded,
  }
}
