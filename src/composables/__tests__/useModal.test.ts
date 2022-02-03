import { describe, assert, it, expect } from 'vitest'
import { nextTick } from 'vue'
import { shallowMount } from '@vue/test-utils'
import ModalComponent from '../../components/Modal.vue'
import { useModal } from '../index'

describe('composable: useModal', () => {
  const modal = useModal()
  const wrapper = shallowMount(ModalComponent, {
    global: {
      renderStubDefaultSlot: true,
    },
  })
  let modalPromise: Promise<boolean>

  it('is not shown by default', () => {
    assert.equal(modal.isShown, false)
    assert.equal(wrapper.find('[data-test="modal"]').exists(), false)
  })
  it('has no "title" text defined by default', () => {
    assert.equal(modal.title, '')
  })
  it('has no "body" texts defined by default', () => {
    assert.equal(modal.body, '')
  })
  it('has no "confirmText" texts defined by default', () => {
    assert.equal(modal.confirmText, '')
  })
  it('has no "cancelText" texts defined by default', () => {
    assert.equal(modal.cancelText, '')
  })
  it('will be shown after show method is called', async () => {
    assert.equal(modal.isShown, false)
    modalPromise = modal.show('title', 'yes', 'no', 'body')
    assert.equal(modal.isShown, true)
    await nextTick()
    assert.equal(wrapper.find('[data-test="modal"]').exists(), true)
  })
  it('will has defined "title" texts after show method is called', () => {
    assert.equal(modal.title, 'title')
    assert.equal(wrapper.get('[data-test="modal-title"]').text(), 'title')
  })
  it('will has defined "body" text after show method is called', () => {
    assert.equal(modal.body, 'body')
    assert.equal(wrapper.get('[data-test="modal-body"]').text(), 'body')
  })
  it('will has defined "confirmText" text after show method is called', () => {
    assert.equal(modal.confirmText, 'yes')
    assert.equal(
      wrapper.get('[data-test="modal-confirm-button"]').text(),
      'yes'
    )
  })
  it('will has defined "cancelText" texts after show method is called', () => {
    assert.equal(modal.cancelText, 'no')
    assert.equal(wrapper.get('[data-test="modal-cancel-button"]').text(), 'no')
  })
  it('will hide the modal after clicking confirmButton', async () => {
    wrapper.get('[data-test="modal-confirm-button"]').trigger('click')
    await nextTick()
    assert.equal(modal.isShown, false)
    assert.equal(wrapper.find('[data-test="modal"]').exists(), false)
  })
  it('will got an resolved promise with value true, after clicking confirmButton', async () => {
    await expect(modalPromise).resolves.toEqual(true)
  })
})
