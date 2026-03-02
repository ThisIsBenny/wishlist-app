import { configDefaults, defineConfig } from 'vitest/config'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./vitest.setup.ts', './vitest.api.setup.ts'],
    include: ['src/api/__tests__/**/*.test.ts'],
    exclude: [
      ...configDefaults.exclude,
      'src/components/**/*',
      'src/views/**/*',
      'src/composables/__tests__/**',
    ],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/api/**/*.ts'],
      exclude: [
        'src/components/icons/**/*',
        'src/**/*.d.ts',
        'src/**/__tests__/**',
        'node_modules/**',
        'dist/**',
      ],
    },
  },
})
