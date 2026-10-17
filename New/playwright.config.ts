import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './js/tests', testMatch: '**/*.spec.ts',
  fullyParallel: true, workers: 2, retries: 0,
  reporter: 'list', outputDir: 'test-results',
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure',
    channel: process.env.PW_BROWSER_CHANNEL || undefined },
  webServer: { command: 'npm run serve:built', url: 'http://127.0.0.1:4173/Portfolio-YoungSliker/New/', reuseExistingServer: false },
});
