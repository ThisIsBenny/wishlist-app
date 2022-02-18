<template>
  <Form
    @submit="onSubmit"
    :validation-schema="schema"
    v-slot="{ meta }"
    class="w-full flex-col"
  >
    <InputText
      name="title"
      type="text"
      :value="wishlist.title"
      :label="t('components.form-wishlist.title.label')"
    />
    <InputToggle
      name="public"
      :value="wishlist.public"
      :label="t('components.form-wishlist.public.label')"
    />
    <InputTextArea
      name="description"
      type="text"
      :value="wishlist.description"
      height-class="h-20"
      :label="t('components.form-wishlist.description.label')"
    />
    <InputText
      name="imageSrc"
      type="text"
      :value="wishlist.imageSrc"
      :label="t('components.form-wishlist.image-src.label')"
    />
    <InputFile
      name="imageFile"
      :label="t('components.form-wishlist.image-file.label')"
    />
    <InputText
      name="slugUrlText"
      type="text"
      :value="wishlist.slugUrlText"
      :label="t('components.form-wishlist.slug-text.label')"
    />
    <ButtonBase
      class="h-12 w-full"
      mode="primary"
      :disabled="!meta.valid"
      :icon="IconSave"
      >{{ t('components.form-wishlist.submit.text') }}</ButtonBase
    >
  </Form>
</template>

<script setup lang="ts">
import { Wishlist } from '@/types'
import { useI18n } from 'vue-i18n'
import { Form } from 'vee-validate'
import IconSave from '@/components/icons/IconSave.vue'
import { object, string, boolean } from 'yup'

defineProps<{
  wishlist: Wishlist
}>()

const emits = defineEmits(['update'])

const { t } = useI18n()

const schema = object().shape(
  {
    title: string().required(
      t('components.form-wishlist.title.error-requried')
    ),
    public: boolean(),
    description: string().max(
      300,
      t('components.form-wishlist.description.error-max')
    ),
    slugUrlText: string().required(
      t('components.form-wishlist.slug-text.error-requried')
    ),
    imageSrc: string().when('imageFile', {
      is: (imageFile: string) => !imageFile || imageFile.length === 0,
      then: string().required(
        t('components.form-wishlist.image-src.error-requried')
      ),
    }),
    imageFile: string().when('imageSrc', {
      is: (imageSrc: string) => !imageSrc || imageSrc.length === 0,
      then: string().required(
        t('components.form-wishlist.image-file.error-requried')
      ),
    }),
  },
  //@ts-expect-error ...
  ['imageSrc', 'imageFile']
)

const onSubmit = async (values: any): Promise<void> => {
  values.imageSrc = values.imageFile || values.imageSrc
  emits('update', values)
}
</script>
