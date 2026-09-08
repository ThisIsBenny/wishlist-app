<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { object, string } from 'yup'
import { useAuth } from '@/composables'
import { useAuthConfig } from '@/composables/useAuthConfig'
import { apiConfig } from '@/config'

const router = useRouter()
const route = useRoute()
const { login } = useAuth()
const { emailLoginEnabled, oidcProviders } = useAuthConfig()
const { t } = useI18n()

const apiError = ref<string | null>(null)

const errorFromQuery = route.query.error as string | undefined
if (errorFromQuery) {
  if (errorFromQuery === 'invalid_state') {
    apiError.value = t('errors.generic.text')
  } else if (errorFromQuery === 'token_validation_failed') {
    apiError.value = t('errors.generic.text')
  } else {
    apiError.value = t('errors.generic.text')
  }
}

const schema = object({
  email: string()
    .required(t('pages.login-view.main.form.email.error-required'))
    .email(t('pages.login-view.main.form.email.error-email')),
  password: string().required(
    t('pages.login-view.main.form.password.error-required')
  ),
})

const { handleSubmit, meta } = useForm({
  validationSchema: schema,
})

const onSubmit = handleSubmit(async (formValues) => {
  apiError.value = null
  try {
    await login(formValues.email as string, formValues.password as string)
    router.push('/')
  } catch (err: any) {
    if (err.message?.includes('disabled')) {
      apiError.value = t('pages.login-view.main.login-disabled.text')
    } else if (err.message?.includes('Invalid email or password')) {
      apiError.value = t('pages.login-view.main.invalid-credentials.text')
    } else if (
      err.message?.includes('rate limit') ||
      err.message?.includes('429')
    ) {
      apiError.value = t('pages.login-view.main.rate-limit.text')
    } else {
      apiError.value = t('errors.generic.text')
    }
  }
})

const sortedProviders = computed(() => {
  return [...oidcProviders.value].sort((a, b) => a.name.localeCompare(b.name))
})
</script>

<template>
  <div class="flex h-full">
    <div
      class="m-auto rounded-md border-2 border-stone-200 px-6 py-10 dark:border-stone-700 sm:w-1/2"
    >
      <h1 class="text-semibold mb-8 text-center text-3xl">
        {{ t('pages.login-view.main.title.text') }}
      </h1>

      <div v-if="apiError" class="mb-4 text-sm text-red-500">
        {{ apiError }}
      </div>

      <div
        v-if="!emailLoginEnabled && sortedProviders.length === 0"
        class="text-center text-red-500"
      >
        {{ t('pages.login-view.main.login-disabled.text') }}
      </div>

      <form
        v-if="emailLoginEnabled"
        @submit="onSubmit"
        class="w-full flex-col space-y-3"
      >
        <InputText
          name="email"
          type="email"
          :label="t('pages.login-view.main.form.email.label')"
          autocomplete="email"
        />
        <InputText
          name="password"
          type="password"
          :label="t('pages.login-view.main.form.password.label')"
          autocomplete="current-password"
        />
        <ButtonBase
          class="h-12 w-full"
          mode="primary"
          :disabled="!meta.dirty || !meta.valid"
        >
          {{ t('pages.login-view.main.form.submit.text') }}
        </ButtonBase>
      </form>

      <div v-if="oidcProviders.length > 0" class="mt-4 space-y-2">
        <div v-for="provider in sortedProviders" :key="provider.id">
          <a
            :href="`${apiConfig.baseURL}/auth/oidc/${provider.id}/login`"
            class="block w-full rounded-md border border-stone-300 px-4 py-2 text-center hover:bg-stone-100 dark:border-stone-600 dark:hover:bg-stone-800"
          >
            {{
              t('pages.login-view.main.oidc-login.text', {
                provider: provider.name,
              })
            }}
          </a>
        </div>
      </div>

      <div class="mt-4 text-center text-sm">
        <router-link
          to="/register"
          class="text-blue-600 hover:underline dark:text-blue-400"
        >
          {{ t('pages.login-view.main.register-link.text') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
