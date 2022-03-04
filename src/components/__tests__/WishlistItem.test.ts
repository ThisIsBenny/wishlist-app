import { describe, assert, it, afterEach } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import WishlistItem from '../WishlistItem.vue'
import i18n from '@/config/i18n'
import { WishlistItem as WishlistItemType } from '@/types'

const defaultWishlistItem: WishlistItemType = {
  title: 'Item 1',
  description: 'Description',
  id: 1,
  url: 'http://url',
  imageSrc: 'http://imageurl',
  bought: false,
}

describe('component: WishlistItem', () => {
  let wrapper: VueWrapper

  const createComponennt = (propsData: { item: WishlistItemType }): void => {
    wrapper = shallowMount(WishlistItem, {
      propsData,
      global: {
        renderStubDefaultSlot: true,
        plugins: [i18n],
      },
    })
  }

  it('shows image if imageSrc is provided', () => {
    createComponennt({ item: defaultWishlistItem })
    assert.equal(wrapper.find('[data-test="preview-image"]').exists(), true)
  })

  it('shows fallback image if imageSrc is not providedn', () => {
    const item = defaultWishlistItem
    item.imageSrc = ''
    createComponennt({ item })
    assert.equal(wrapper.find('[data-test="preview-image"]').exists(), true)
  })

  it('shows title', () => {
    createComponennt({ item: defaultWishlistItem })
    assert.equal(wrapper.find('[data-test="title"]').exists(), true)
  })

  it('shows descriptions', () => {
    createComponennt({ item: defaultWishlistItem })
    assert.equal(wrapper.find('[data-test="descriptions"]').exists(), true)
  })

  it('shows bought button', () => {
    createComponennt({ item: defaultWishlistItem })
    assert.equal(wrapper.find('[data-test="bought-button"]').exists(), true)
  })

  it('shows link if url is provided', () => {
    createComponennt({ item: defaultWishlistItem })
    assert.equal(wrapper.find('[data-test="link"]').exists(), true)
  })

  it('shows no link if url is not provided', () => {
    const item = defaultWishlistItem
    item.url = ''
    createComponennt({ item })
    assert.equal(wrapper.find('[data-test="link"]').exists(), false)
  })

  afterEach(() => {
    wrapper.unmount()
  })
})
