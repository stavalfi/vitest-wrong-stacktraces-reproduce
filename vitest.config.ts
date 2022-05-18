/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

// @ts-ignore
export default defineConfig({
  // @ts-ignore
  plugins: [tsconfigPaths({ root: __dirname })],
  test: {
    environment: 'node',
    watch: false,
    testTimeout: 60_000,
    env: {
      IS_TEST_MODE: 'true',
    },
    allowOnly: true,
    setupFiles: [path.join(__dirname, 'vitest.before-all.ts')],
  },
})
