<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Wishlist } from '@/types'
import { useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { useWishlistStore } from '@/composables'
import { useToast } from 'vue-toastification'

const router = useRouter()
const { t } = useI18n()
const toast = useToast()
const { create } = useWishlistStore()

useTitle(t('pages.create-wishlist-view.title.text'))

const handleCreateWishlist = async (wishlist: Wishlist): Promise<void> => {
  try {
    await create(wishlist)
    toast.success(t('common.saved.text'))
    router.push(`/${wishlist.slugUrlText}`)
  } catch (error) {
    toast.error(t('common.saving-failed.text'))
  }
}
</script>

<template>
  <div class="h-full">
    <h1 class="mb-6 text-xl font-bold">
      {{ t('pages.create-wishlist-view.headline.text') }}
    </h1>
    <FormWishlist @create="handleCreateWishlist" />
  </div>
</template>
