<template>
  <div
    class="flex h-fit flex-col space-x-0 overflow-hidden rounded-md border-2 border-stone-200 dark:border-stone-700 sm:flex-row sm:space-x-2"
  >
    <ImagePreview
      class="max-h-44 flex-shrink-0 flex-grow-0 object-cover sm:w-1/4"
      :src="item.imageSrc"
      :alt="item.title"
    />

    <div class="flex w-full flex-col justify-between space-y-2 p-2">
      <Form
        @submit="onSubmit"
        :validation-schema="schema"
        v-slot="{ meta }"
        class="w-full flex-col"
      >
        <InputText
          name="title"
          type="text"
          :value="item.title"
          :label="t('components.form-wishlist-item.title.label')"
        />
        <InputTextArea
          name="description"
          type="text"
          :value="item.description"
          height-class="h-20"
          :label="t('components.form-wishlist-item.description.label')"
        />
        <InputText
          name="url"
          type="text"
          :value="item.url"
          :label="t('components.form-wishlist-item.url.label')"
        />
        <InputText
          name="imageSrc"
          type="text"
          :value="item.imageSrc"
          :label="t('components.form-wishlist-item.image-src.label')"
        />
        <InputCheckbox
          name="bought"
          :value="item.bought"
          :label="t('components.form-wishlist-item.bought.label')"
        />
        <ButtonBase
          class="h-12 w-full"
          mode="primary"
          :disabled="!meta.valid"
          :icon="IconSave"
          >{{ t('components.form-wishlist-item.submit.text') }}</ButtonBase
        >
      </Form>
      <ButtonBase
        class="h-12 w-full"
        mode="danger"
        @click.prevent="() => emits('delete')"
        :icon="IconDelete"
        >{{ t('components.wishlist-item.delete-button.text') }}</ButtonBase
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { Form } from 'vee-validate'
import ImagePreview from './ImagePreview.vue'
import { object, string, boolean } from 'yup'
import {
  ButtonBase,
  InputText,
  InputCheckbox,
  InputTextArea,
} from '@/components'
import { IconSave, IconDelete } from '@/components/icons'
import { WishlistItem } from '@/types'
defineProps<{
  item: WishlistItem
}>()
const { t } = useI18n()

const emits = defineEmits(['update', 'delete'])

const schema = object({
  title: string().required(
    t('components.form-wishlist-item.title.error-requried')
  ),
  description: string()
    .required(t('components.form-wishlist-item.description.error-requried'))
    .max(300, t('components.form-wishlist-item.description.error-max')),
  url: string().url(t('components.form-wishlist-item.url.error-url')),
  imageSrc: string().url(
    t('components.form-wishlist-item.image-src.error-url')
  ),
  bought: boolean(),
})

const onSubmit = async (values: any): Promise<void> => {
  emits('update', values)
}
</script>
