import { defineConfig } from '@playwright/test';

// Verify the deployed site without silently falling back to a local preview.
export default defineConfig({
  testDir: './js/tests',
  testMatch: ['foundation.spec.ts', 'work-routing.spec.ts', 'work-media.spec.ts', 'graph-return.spec.ts', 'journey-return.spec.ts', 'phase6-navigation.spec.ts'],
  workers: 1,
  timeout: 90000,
  expect: { timeout: 30000 },
  retries: 1,
  reporter: 'list',
  outputDir: 'test-results/online',
  use: {
    baseURL: 'https://youngsliker.github.io',
    channel: process.env.PW_BROWSER_CHANNEL || 'msedge',
    navigationTimeout: 60000,
    trace: 'retain-on-failure',
  },
});
