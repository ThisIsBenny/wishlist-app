<template>
  <div class="relative mb-8">
    <label class="mb-1 block w-full" :for="name">{{ label }}</label>
    <div
      class="flex h-24 w-full flex-row items-center space-x-10 rounded-md border-2 border-solid border-stone-300 bg-transparent px-2 outline-none dark:border-stone-700"
      :class="{
        'border-rose-500': !!errorMessage,
        'border-dotted bg-stone-200/20': showDropzone,
      }"
      @drop.prevent="handleDrop"
      @dragover.prevent="showDropzone = true"
      @dragleave.prevent="showDropzone = false"
    >
      <div class="h-20 w-20">
        <ImagePreview :src="value" class="h-full w-full" />
      </div>
      <div>
        <i18n-t
          keypath="components.wishlist-header.main.form.image-file.text-dropzone"
          tag="p"
          for="components.wishlist-header.main.form.image-file.text-dropzone-link"
        >
          <button
            class="cursor-pointer text-cyan-600"
            @click.prevent="fileInput.click()"
          >
            {{
              t(
                'components.wishlist-header.main.form.image-file.text-dropzone-link'
              )
            }}
          </button>
        </i18n-t>
        <input
          ref="fileInput"
          class="hidden"
          :name="name"
          :id="name"
          type="file"
          @change="handleChange"
        />
      </div>
    </div>
    <p class="absolute mt-2 text-sm text-rose-500" v-show="errorMessage">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate'
import { ImagePreview } from './'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
type FileEventTarget = EventTarget & { files: FileList }
const fileInput = ref()
const showDropzone = ref(false)

const { t } = useI18n()

const props = defineProps({
  accept: {
    type: String,
    default: 'image/*',
  },
  value: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
})

const { value, errorMessage } = useField(props.name, undefined, {})

const convertBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)

    fileReader.onload = () => {
      resolve(fileReader.result as string)
    }

    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}

const handleChange = async (event: any) => {
  const file = (event.target as FileEventTarget).files[0]
  value.value = await convertBase64(file)
}
const handleDrop = async (event: any) => {
  let droppedFiles = event.dataTransfer.files
  if (!droppedFiles) return
  value.value = await convertBase64(droppedFiles[0])
}
</script>
