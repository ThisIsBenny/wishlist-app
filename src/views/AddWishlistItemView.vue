<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Wishlist, WishlistItem } from '@/types'
import { useRoute, useRouter } from 'vue-router'
import { useWishlistsStore, useWishlistStore } from '@/composables'
import { useToast } from 'vue-toastification'
import { useFetch } from '@/composables/useFetch'
import { syncRef, useTitle, watchOnce } from '@vueuse/core'
import { Ref, ref } from 'vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const toast = useToast()

const isFinished = ref(true)
const selectedWishlist: Ref<Wishlist | undefined> = ref()
const prefillData = ref({
  title: '',
  description: '',
  imageSrc: '',
  url: '',
  bought: false,
})

const { createItem } = useWishlistStore()

const {
  state: wishlists,
  isFinished: loadWishlistsFinished,
  fetch,
} = useWishlistsStore()

fetch()

if (route.query.url) {
  prefillData.value.url = route.query.url as string
  const { data: opData, isFinished: opDataLoaded } = useFetch(
    `/utils/fetch-open-graph?url=${route.query.url}`
  ).json()
  syncRef(opDataLoaded, isFinished)

  watchOnce(opData, () => {
    prefillData.value = {
      ...prefillData.value,
      ...opData.value,
    }
  })
}

useTitle(t('pages.create-wishlist-item-view.title.text'))

const handleCreateItem = async (values: WishlistItem): Promise<void> => {
  try {
    await createItem(values, selectedWishlist?.value?.id)
    toast.success(t('common.saved.text'))
    router.push(`/${selectedWishlist?.value?.slugUrlText}`)
  } catch (error) {
    console.error(error)
    toast.error(t('common.saving-failed.text'))
  }
}
</script>

<template>
  <div class="h-full">
    <div
      v-if="!isFinished || !loadWishlistsFinished"
      class="flex h-1/2 w-full flex-col justify-center"
    >
      <div
        class="m-20 flex flex-row content-center items-center justify-center space-x-2"
      >
        <IconSpinner class="h-4 w-4" />
        <span> {{ t('pages.create-wishlist-item-view.loading.text') }} </span>
      </div>
    </div>
    <div v-else-if="loadWishlistsFinished && selectedWishlist === undefined">
      <h1 class="text-center text-xl font-bold">
        {{
          t('pages.create-wishlist-item-view.headline-wishlist-selection.text')
        }}
      </h1>
      <div
        class="m-8 flex flex-row flex-wrap content-center items-center justify-center sm:space-x-2"
      >
        <div
          v-for="item in wishlists"
          :key="item.id"
          @click="() => (selectedWishlist = item)"
          class="cursor-pointer"
        >
          <ImageTile
            :title="item.title"
            :image-src="item.imageSrc"
            class="m-4"
          />
        </div>
      </div>
    </div>
    <FormWishlistItem :item="prefillData" v-else @create="handleCreateItem" />
  </div>
</template>
