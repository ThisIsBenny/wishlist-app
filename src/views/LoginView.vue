<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Form } from 'vee-validate'
import { object, string } from 'yup'
import { useAuth } from '@/composables'
import BaseButton from '@/components/BaseButton.vue'
import TextInput from '@/components/TextInput.vue'

const router = useRouter()
const { setToken } = useAuth()

const { t } = useI18n()

const schema = object({
  'api-key': string().required(
    t('pages.login-view.main.form.api-key.error-requried')
  ),
})

const onSubmit = (values: any): void => {
  setToken(values['api-key'])
  router.push('/')
}
</script>

<template>
  <div class="flex h-full">
    <div
      class="m-auto w-1/2 rounded-md border-2 border-stone-200 px-6 py-10 dark:border-stone-700"
    >
      <h1 class="text-semibold mb-8 text-center text-3xl">
        {{ t('pages.login-view.main.title.text') }}
      </h1>
      <Form
        @submit="onSubmit"
        :validation-schema="schema"
        v-slot="{ meta }"
        class="w-full flex-col space-y-3"
      >
        <TextInput
          name="api-key"
          type="text"
          :label="t('pages.login-view.main.form.api-key.placeholder')"
          autocomplete="off"
        />
        <BaseButton
          class="h-12 w-full"
          mode="primary"
          :disabled="!meta.dirty || !meta.valid"
          >{{ t('pages.login-view.main.form.submit.text') }}</BaseButton
        >
      </Form>
    </div>
  </div>
</template>
