import { test, expect } from '../fixtures/page.fixture';

/**
 * Visual Regression Tests for Login Page
 * Target Application: https://testerbud.com/practice-login-form
 * 
 * Update baselines: npx playwright test login-visual.spec.ts --update-snapshots
 */

test.describe('Feature: Login Page Visual Tests @visual @login', () => {
  
  test('VIS001 - Login form matches baseline screenshot @high', async ({ loginPage }) => {
    await test.step('Given the login page is loaded', async () => {
      await expect(loginPage.form).toBeVisible();
    });

    await test.step('Then the login form should match the baseline', async () => {
      await expect(loginPage.form).toHaveScreenshot('login-form.png', {
        animations: 'disabled',
      });
    });
  });
});
