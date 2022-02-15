<template>
  <div
    class="flex flex-col items-center space-x-0 space-y-2 md:flex-row md:space-x-6 md:space-y-0"
    v-if="modelValue !== undefined"
  >
    <ImageTile :image-src="modelValue.imageSrc" class="shrink-0"></ImageTile>
    <div v-if="!editModeIsActive">
      <h1 class="mb-2 text-center text-2xl font-bold md:text-left">
        {{ modelValue.title }}
      </h1>
      <p class="text-lg">
        {{ modelValue.description }}
      </p>
    </div>
    <Form
      v-else
      @submit="onSubmit"
      :validation-schema="schema"
      v-slot="{ meta }"
      class="w-full flex-col"
    >
      <InputText
        name="title"
        type="text"
        :value="modelValue.title"
        :label="t('components.wishlist-header.main.form.title.label')"
      />
      <InputCheckbox
        name="public"
        :value="modelValue.public"
        :label="t('components.wishlist-header.main.form.public.label')"
      />
      <InputTextArea
        name="description"
        type="text"
        :value="modelValue.description"
        height-class="h-20"
        :label="t('components.wishlist-header.main.form.description.label')"
      />
      <InputText
        name="imageSrc"
        type="text"
        :value="modelValue.imageSrc"
        :label="t('components.wishlist-header.main.form.image-src.label')"
      />
      <InputText
        name="slugUrlText"
        type="text"
        :value="modelValue.slugUrlText"
        :label="t('components.wishlist-header.main.form.slug-text.label')"
      />
      <ButtonBase
        class="h-12 w-full"
        mode="primary"
        :disabled="!meta.valid"
        :icon="IconSave"
        >{{ t('components.wishlist-header.main.form.submit.text') }}</ButtonBase
      >
    </Form>
  </div>
</template>

<script setup lang="ts">
import { Wishlist } from '@/types'
import { PropType } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Form } from 'vee-validate'
import { object, string, boolean } from 'yup'
import { useToast } from 'vue-toastification'
import {
  ButtonBase,
  ImageTile,
  InputText,
  InputCheckbox,
  InputTextArea,
} from '@/components'
import { IconSave } from '@/components/icons'
import { useEditMode, useWishlistStore } from '@/composables'

defineProps({
  modelValue: {
    type: Object as PropType<Wishlist>,
    requried: true,
  },
})

const router = useRouter()
const toast = useToast()

const { isActive: editModeIsActive } = useEditMode()
const { update } = useWishlistStore()

const { t } = useI18n()

const schema = object({
  title: string().required(
    t('components.wishlist-header.main.form.title.error-requried')
  ),
  public: boolean(),
  description: string().max(
    300,
    t('components.wishlist-header.main.form.description.error-max')
  ),
  slugUrlText: string().required(
    t('components.wishlist-header.main.form.slug-text.error-requried')
  ),
  imageSrc: string()
    .required(
      t('components.wishlist-header.main.form.image-src.error-requried')
    )
    .url(t('components.wishlist-header.main.form.image-src.error-url')),
})

const onSubmit = async (values: any): Promise<void> => {
  try {
    await update(values)
    toast.success(t('common.wishlist.saved.text'))
    router.push(`/${values.slugUrlText}`)
  } catch (error) {
    toast.error(t('common.wishlist.saving-failed.text'))
  }
}
</script>
