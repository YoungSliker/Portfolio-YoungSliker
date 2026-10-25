import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './js/tests', testMatch: '**/*.spec.ts',
  fullyParallel: true, workers: 2, retries: 0,
  reporter: 'list', outputDir: 'test-results',
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure',
    browserName: (process.env.PW_ENGINE || 'chromium') as 'chromium'|'firefox'|'webkit',
    channel: !process.env.PW_ENGINE || process.env.PW_ENGINE==='chromium' ? process.env.PW_BROWSER_CHANNEL || undefined : undefined },
  webServer: [
    { command: 'npm run serve:built', url: 'http://127.0.0.1:4173/Portfolio-YoungSliker/New/', reuseExistingServer: false },
    { command: 'npm run dev', url: 'http://127.0.0.1:5173/Portfolio-YoungSliker/New/', reuseExistingServer: true },
  ],
});
