import { describe, it, expect } from 'vitest'
import useAxios from '../useAxios'

describe('composable: useAxios', () => {
  it('provides client axios instance', () => {
    const { client } = useAxios()
    expect(client).toBeDefined()
    expect(typeof client.get).toBe('function')
    expect(typeof client.post).toBe('function')
    expect(typeof client.put).toBe('function')
    expect(typeof client.delete).toBe('function')
  })

  it('provides isLoading ref', () => {
    const { isLoading } = useAxios()
    expect(isLoading.value).toBe(false)
  })

  it('provides error ref', () => {
    const { error } = useAxios()
    expect(error.value).toBeNull()
  })
})
