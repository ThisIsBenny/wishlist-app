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
      :label="t('components.wishlist-header.main.form.title.label')"
    />
    <InputCheckbox
      name="public"
      :value="wishlist.public"
      :label="t('components.wishlist-header.main.form.public.label')"
    />
    <InputTextArea
      name="description"
      type="text"
      :value="wishlist.description"
      height-class="h-20"
      :label="t('components.wishlist-header.main.form.description.label')"
    />
    <InputText
      name="imageSrc"
      type="text"
      :value="wishlist.imageSrc"
      :label="t('components.wishlist-header.main.form.image-src.label')"
    />
    <InputFile
      name="imageFile"
      :label="t('components.wishlist-header.main.form.image-file.label')"
    />
    <InputText
      name="slugUrlText"
      type="text"
      :value="wishlist.slugUrlText"
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
  InputText,
  InputFile,
  InputCheckbox,
  InputTextArea,
} from '@/components'
import { IconSave } from '@/components/icons'
import { useWishlistStore } from '@/composables'

defineProps({
  wishlist: {
    type: Object as PropType<Wishlist>,
    requried: true,
  },
})

const router = useRouter()
const toast = useToast()

const { update } = useWishlistStore()

const { t } = useI18n()

const schema = object().shape(
  {
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
    imageSrc: string().when('imageFile', {
      is: (imageFile: string) => !imageFile || imageFile.length === 0,
      then: string().required(
        t('components.wishlist-header.main.form.image-src.error-requried')
      ),
    }),
    imageFile: string().when('imageSrc', {
      is: (imageSrc: string) => !imageSrc || imageSrc.length === 0,
      then: string().required(
        t('components.wishlist-header.main.form.image-file.error-requried')
      ),
    }),
  },
  //@ts-expect-error ...
  ['imageSrc', 'imageFile']
)

const onSubmit = async (values: any): Promise<void> => {
  try {
    values.imageSrc = values.imageFile || values.imageSrc
    await update(values)
    toast.success(t('common.wishlist.saved.text'))
    router.push(`/${values.slugUrlText}`)
  } catch (error) {
    toast.error(t('common.wishlist.saving-failed.text'))
  }
}
</script>
