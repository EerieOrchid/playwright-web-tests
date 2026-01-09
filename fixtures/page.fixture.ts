import { test as base } from '@playwright/test';
import { LoginFormPage } from '../pages/login.po';
import { logger } from '../utils/logger';

/**
 * Custom test fixtures for page objects
 * Centralizes page object initialization
 */

// Define the types for our custom fixtures
type PageFixtures = {
  loginPage: LoginFormPage;
};

/**
 * Extended test with page object fixtures
 * Usage: import { test, expect } from '../fixtures/page.fixture';
 */
export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    logger.debug('Initializing LoginFormPage fixture');
    const loginPage = new LoginFormPage(page);
    await loginPage.navigateTo();
    await use(loginPage);
    logger.debug('LoginFormPage fixture cleanup complete');
  },
});

export { expect } from '@playwright/test';
