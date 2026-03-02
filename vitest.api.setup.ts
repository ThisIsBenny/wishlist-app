import { vi } from 'vitest'

vi.stubGlobal('crypto', {
  getRandomValues: (arr) => {
    for (let i = 0; i < arr.length; i++) {
      arr[i] = Math.floor(Math.random() * 256)
    }
    return arr
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
