import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'packages/kitbook/vitest.config.ts',
  'packages/mdsvex-shiki-twoslash/vitest.config.ts',
  'packages/rehype-display-link-titles/vitest.config.ts',
  'packages/remark-story-code-preview/vitest.config.ts',
  'packages/svelte-pieces/vitest.config.ts',
  'packages/vite-plugin-kitbook/vitest.config.ts',
])