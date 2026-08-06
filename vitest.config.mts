import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  test: {
    // These suites cover pure data/validation logic, so no DOM is needed.
    environment: 'node',
    include: ['**/*.test.ts'],
    exclude: ['node_modules/**', '.next/**'],
  },
  resolve: {
    // Mirrors the "@/*" path alias from tsconfig.json.
    alias: { '@': fileURLToPath(new URL('.', import.meta.url)) },
  },
})
