import { vi } from 'vitest'

const originalCrypto = globalThis.crypto

beforeAll(() => {
  Object.defineProperty(globalThis, 'navigator', {
    value: {
      language: 'en-US',
      userAgent: 'node.js',
    },
    writable: true,
  })

  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0,
    },
    writable: true,
  })

  if (!globalThis.crypto || !globalThis.crypto.getRandomValues) {
    Object.defineProperty(globalThis, 'crypto', {
      value: {
        getRandomValues: (arr: Uint8Array) => {
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
      },
      writable: true,
    })
  }
})

afterAll(() => {
  if (originalCrypto) {
    Object.defineProperty(globalThis, 'crypto', {
      value: originalCrypto,
      writable: true,
    })
  }
})
