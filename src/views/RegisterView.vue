<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { object, string } from 'yup'
import { useAuth } from '@/composables'
import { useAuthConfig } from '@/composables/useAuthConfig'

const router = useRouter()
const { register } = useAuth()
const { emailRegisterEnabled } = useAuthConfig()
const { t } = useI18n()

const apiError = ref<string | null>(null)

const schema = object({
  email: string()
    .required(t('pages.register-view.main.form.email.error-required'))
    .email(t('pages.register-view.main.form.email.error-email')),
  password: string()
    .required(t('pages.register-view.main.form.password.error-required'))
    .min(8, t('pages.register-view.main.form.password.policy-min-length')),
})

const { handleSubmit, meta, values } = useForm({
  validationSchema: schema,
})

const onSubmit = handleSubmit(async (formValues) => {
  apiError.value = null
  try {
    await register(
      formValues.email as string,
      formValues.password as string
    )
    router.push('/')
  } catch (err: any) {
    const message = err.message || ''
    if (message.includes('already exists') || message.includes('Conflict')) {
      apiError.value = t('pages.register-view.main.email-taken.text')
    } else if (message.includes('disabled')) {
      apiError.value = t('pages.register-view.main.register-disabled.text')
    } else {
      apiError.value = t('pages.register-view.main.validation-error.text')
    }
  }
})

const passwordPolicies = computed(() => {
  const pwd = (values.password as string) || ''
  return [
    {
      key: 'min-length',
      label: t('pages.register-view.main.form.password.policy-min-length'),
      valid: pwd.length >= 8,
    },
    {
      key: 'uppercase',
      label: t('pages.register-view.main.form.password.policy-uppercase'),
      valid: /[A-Z]/.test(pwd),
    },
    {
      key: 'lowercase',
      label: t('pages.register-view.main.form.password.policy-lowercase'),
      valid: /[a-z]/.test(pwd),
    },
    {
      key: 'digit',
      label: t('pages.register-view.main.form.password.policy-digit'),
      valid: /[0-9]/.test(pwd),
    },
    {
      key: 'special',
      label: t('pages.register-view.main.form.password.policy-special'),
      valid: /[^A-Za-z0-9]/.test(pwd),
    },
  ]
})
</script>

<template>
  <div class="flex h-full">
    <div class="m-auto rounded-md border-2 border-stone-200 px-6 py-10 dark:border-stone-700 sm:w-1/2">
      <h1 class="text-semibold mb-8 text-center text-3xl">
        {{ t('pages.register-view.main.title.text') }}
      </h1>

      <div v-if="!emailRegisterEnabled" class="text-center text-red-500">
        {{ t('pages.register-view.main.register-disabled.text') }}
      </div>

      <form v-else @submit="onSubmit" class="w-full flex-col space-y-3">
        <InputText name="email" type="email" :label="t('pages.register-view.main.form.email.label')"
          autocomplete="email" />

        <InputText name="password" type="password" :label="t('pages.register-view.main.form.password.label')"
          autocomplete="new-password" />

        <div class="text-xs text-stone-500 dark:text-stone-400">
          <div v-for="policy in passwordPolicies" :key="policy.key" :class="policy.valid ? 'text-emerald-600' : ''">
            {{ policy.valid ? '✓' : '○' }} {{ policy.label }}
          </div>
        </div>

        <div v-if="apiError" class="text-sm text-red-500">
          {{ apiError }}
        </div>

        <ButtonBase class="h-12 w-full" mode="primary" :disabled="!meta.dirty || !meta.valid">
          {{ t('pages.register-view.main.form.submit.text') }}
        </ButtonBase>
      </form>

      <div class="mt-4 text-center text-sm">
        <router-link to="/login" class="text-blue-600 hover:underline dark:text-blue-400">
          {{ t('pages.register-view.main.login-link.text') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
