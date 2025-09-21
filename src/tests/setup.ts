import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@vue/test-utils'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})