import { defineConfig, devices } from '@playwright/test';

declare const process: {
  env: Record<string, string | undefined>;
};

/**
 * Playwright Configuration
 * Supports cross-browser testing with Chromium, Firefox, and WebKit
 *
 * Run tests:
 *   npx playwright test                    # Run all tests on all browsers
 *   npx playwright test --project=chromium # Run only on Chromium
 *   npx playwright test --project=firefox  # Run only on Firefox
 *   npx playwright test --project=webkit   # Run only on WebKit
 *   npx playwright test --headed           # Run in headed mode
 */

export default defineConfig({
  // Test directory
  testDir: './specs',

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry failed tests on CI
  retries: process.env.CI ? 2 : 0,

  // Limit parallel workers on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['list'],
    ['html', { open: 'always' }],
    [
      'allure-playwright',
      {
        outputFolder: 'allure-results',
        detail: true,
        suiteTitle: true,
        categories: [
          {
            name: 'Outdated tests',
            messageRegex: '.*FileNotFound.*',
          },
          {
            name: 'Product defects',
            messageRegex: '.*AssertionError.*',
          },
        ],
        environmentInfo: {
          framework: 'Playwright',
          node_version: process.env.NODE_VERSION || 'unknown',
        },
      },
    ],
  ],

  // Shared settings for all projects
  use: {
    // Base URL for navigation
    baseURL: 'https://testerbud.com',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video recording
    video: 'retain-on-failure',

    // Timeout for actions
    actionTimeout: 10000,

    // Timeout for navigation
    navigationTimeout: 30000,
  },

  // Global timeout for each test
  timeout: 60000,

  // Output directory for test artifacts
  outputDir: './test-results',

  // Configure projects for cross-browser testing
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Mobile viewports
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] },
    },

    // Branded browsers (optional - requires installation)
    // {
    //   name: 'edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});
