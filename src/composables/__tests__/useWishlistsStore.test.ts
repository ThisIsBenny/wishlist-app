import { describe, it, expect } from 'vitest'
import { useWishlistsStore } from '../useWishlistsStore'

describe('composable: useWishlistsStore', () => {
  it('provides state as empty array by default', () => {
    const { state } = useWishlistsStore()
    expect(state.value).toEqual([])
  })

  it('provides isFinished as false by default', () => {
    const { isFinished } = useWishlistsStore()
    expect(isFinished.value).toBe(false)
  })

  it('provides error as undefined by default', () => {
    const { error } = useWishlistsStore()
    expect(error.value).toBeUndefined()
  })

  it('provides fetch function', () => {
    const { fetch } = useWishlistsStore()
    expect(typeof fetch).toBe('function')
  })
})
