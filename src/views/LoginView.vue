<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { object, string } from 'yup'
import { useAuth } from '@/composables'
import IconLogin from '@/components/icons/IconLogin.vue'

const router = useRouter()
const { setToken } = useAuth()

const { t } = useI18n()

const schema = object({
  'api-key': string().required(
    t('pages.login-view.main.form.api-key.error-requried')
  ),
})

const { handleSubmit, meta } = useForm({
  validationSchema: schema,
})

const onSubmit = handleSubmit((values) => {
  setToken(values['api-key'] as string)
  router.push('/')
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
      <form @submit="onSubmit" class="w-full flex-col space-y-3">
        <InputText
          name="api-key"
          type="text"
          :label="t('pages.login-view.main.form.api-key.placeholder')"
          autocomplete="off"
        />
        <ButtonBase
          class="h-12 w-full"
          mode="primary"
          :icon="IconLogin"
          :disabled="!meta.dirty || !meta.valid"
          >{{ t('pages.login-view.main.form.submit.text') }}</ButtonBase
        >
      </form>
    </div>
  </div>
</template>
