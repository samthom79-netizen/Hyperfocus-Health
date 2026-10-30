import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

// The cloud build machine ships browsers at /opt/pw-browsers. Elsewhere,
// Playwright uses its own default location (`npx playwright install`).
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync('/opt/pw-browsers')) {
  process.env.PLAYWRIGHT_BROWSERS_PATH = '/opt/pw-browsers';
}

/**
 * End-to-end checks run against the BUILT site (astro preview), so they test
 * exactly what gets deployed, including pre-rendered HTML.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testIgnore: /audit\.spec\.ts/ },
    { name: 'desktop', use: { ...devices['Desktop Chrome'] }, testIgnore: /audit\.spec\.ts/ },
    // The site-wide audit (screenshots, axe, pre-render, checker parity) sets its own viewports.
    { name: 'audit', use: { ...devices['Desktop Chrome'] }, testMatch: /audit\.spec\.ts/ },
  ],
  webServer: {
    // --ignore-lock: Astro's preview keeps a lock file; a stale one from an
    // interrupted run must not stop the test server from starting.
    command: 'npm run build && npx astro preview --host --ignore-lock',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
