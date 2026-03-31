import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/journeys',
  timeout: 90_000,
  expect: {
    timeout: 15_000
  },
  reporter: [['list']],
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: false
  }
});
