import { describe, it, expect } from 'vitest'
import { useWishlistStore } from '../useWishlistStore'

describe('composable: useWishlistStore', () => {
  it('provides state as undefined by default', () => {
    const { state } = useWishlistStore()
    expect(state.value).toBeUndefined()
  })

  it('provides isFinished as false by default', () => {
    const { isFinished } = useWishlistStore()
    expect(isFinished.value).toBe(false)
  })

  it('provides error as null by default', () => {
    const { error } = useWishlistStore()
    expect(error.value).toBeNull()
  })

  it('provides fetch function', () => {
    const { fetch } = useWishlistStore()
    expect(typeof fetch).toBe('function')
  })

  it('provides createWishlist function', () => {
    const { createWishlist } = useWishlistStore()
    expect(typeof createWishlist).toBe('function')
  })

  it('provides updateWishlist function', () => {
    const { updateWishlist } = useWishlistStore()
    expect(typeof updateWishlist).toBe('function')
  })

  it('provides deleteWishlist function', () => {
    const { deleteWishlist } = useWishlistStore()
    expect(typeof deleteWishlist).toBe('function')
  })

  it('provides createItem function', () => {
    const { createItem } = useWishlistStore()
    expect(typeof createItem).toBe('function')
  })

  it('provides updateItem function', () => {
    const { updateItem } = useWishlistStore()
    expect(typeof updateItem).toBe('function')
  })

  it('provides itemBought function', () => {
    const { itemBought } = useWishlistStore()
    expect(typeof itemBought).toBe('function')
  })

  it('provides itemDelete function', () => {
    const { itemDelete } = useWishlistStore()
    expect(typeof itemDelete).toBe('function')
  })

  it('provides filteredItems as computed', () => {
    const { filteredItems } = useWishlistStore()
    expect(Array.isArray(filteredItems.value)).toBe(true)
  })
})
