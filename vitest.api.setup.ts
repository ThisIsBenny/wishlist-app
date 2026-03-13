import { vi } from 'vitest'

process.env.API_KEY = 'TOP_SECRET'
process.env.DATABASE_URL = ':memory:'
process.env.NODE_ENV = 'test'

vi.stubGlobal('crypto', {
  getRandomValues: (arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256)
    }
    return arr
  },
  randomUUID: () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  },
  subtle: {
    encrypt: vi.fn(),
    decrypt: vi.fn(),
    sign: vi.fn(),
    verify: vi.fn(),
    digest: vi.fn(),
    generateKey: vi.fn(),
    deriveKey: vi.fn(),
    deriveBits: vi.fn(),
    importKey: vi.fn(),
    exportKey: vi.fn(),
  },
  timingSafeEqual: vi.fn(),
})

vi.stubGlobal('navigator', {
  userAgent: 'node.js',
})
