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
      <div class="mb-4 flex flex-row items-center space-x-2 text-xl">
        <IconCreation v-if="mode === 'create'" class="h-6 w-6" />
        <IconPencil v-else class="h-5 w-5" />
        <h1 v-if="mode === 'create'">
          {{ t('components.form-wishlist-item.headline-new-item.text') }}
        </h1>
        <h1 v-else>
          {{ t('components.form-wishlist-item.headline-change-item.text') }}
        </h1>
      </div>
      <form @submit="onSubmit" class="w-full flex-col">
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
        <InputToggle
          v-if="mode === 'update'"
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
      </form>
      <ButtonBase
        v-if="mode === 'update'"
        class="h-12 w-full"
        mode="danger"
        @click.prevent="() => emits('delete')"
        :icon="IconDelete"
        >{{ t('components.form-wishlist-item.delete-button.text') }}</ButtonBase
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useForm } from 'vee-validate'
import { object, string, boolean } from 'yup'
import { WishlistItem } from '@/types'
import IconSave from '@/components/icons/IconSave.vue'
import IconDelete from '@/components/icons/IconDelete.vue'
import { PropType } from 'vue'

const props = defineProps({
  mode: {
    type: String,
    required: true,
  },
  item: {
    type: Object as PropType<WishlistItem>,
    default: () => {
      return {
        id: '',
        title: '',
        description: '',
        url: '',
        imageSrc: '',
        bought: false,
      }
    },
  },
})
const emits = defineEmits(['update', 'create', 'delete'])
const { t } = useI18n()

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

const { handleSubmit, resetForm, meta } = useForm({
  validationSchema: schema,
})

const onSubmit = handleSubmit((values) => {
  if (props.mode === 'create') {
    emits('create', values)
    resetForm()
  } else {
    emits('update', values)
  }
})
</script>
