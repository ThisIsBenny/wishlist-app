import { describe, assert, it, expect } from 'vitest'
import { shallowMount, VueWrapper } from '@vue/test-utils'
import ButtonBase from '../ButtonBase.vue'

describe('component: ButtonBase', () => {
  let wrapper: VueWrapper

  const createComponennt = (propsData: { mode: string }): void => {
    wrapper = shallowMount(ButtonBase, {
      propsData,
      global: {
        renderStubDefaultSlot: true,
      },
    })
  }
  it('shows primary button', () => {
    createComponennt({ mode: 'primary' })
    expect(wrapper.get('button')).toMatchSnapshot()
  })
  it('shows dange button', () => {
    createComponennt({ mode: 'dange' })
    expect(wrapper.get('button')).toMatchSnapshot()
  })
  it('shows secondary button', () => {
    createComponennt({ mode: 'secondary' })
    expect(wrapper.get('button')).toMatchSnapshot()
  })
  it('shows secondary button as default', () => {
    createComponennt({ mode: '' })
    expect(wrapper.get('button')).toMatchSnapshot()
  })
})
