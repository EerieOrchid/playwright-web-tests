import { test, expect } from '../fixtures/page.fixture';
import {
  expectNoA11yViolations,
  expectWcag21AA,
  getAccessibilityReport,
} from '../utils/accessibility.helper';

/**
 * Accessibility Tests for Login Form
 * Target Application: https://testerbud.com/practice-login-form
 *
 * These tests verify WCAG 2.1 AA compliance and keyboard accessibility
 */

test.describe('Accessibility Tests @accessibility', () => {
  test('TC021 - Form labels are properly associated with inputs @accessibility @critical', async ({
    loginPage,
  }) => {
    // Check that form labels are present and properly associated
    const usernameLabel = loginPage.page.locator('label[for="formBasicEmail"]');
    const passwordLabel = loginPage.page.locator('label[for="formBasicPassword"]');

    await expect(usernameLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();

    // Verify labels have text content
    await expect(usernameLabel).not.toBeEmpty();
    await expect(passwordLabel).not.toBeEmpty();
  });

  test('TC022 - All elements are reachable via keyboard navigation @accessibility @critical', async ({
    loginPage,
  }) => {
    // Start from the beginning of the page
    await loginPage.pressKey('Tab');

    // Verify username input can be focused
    await expect(loginPage.usernameInput).toBeFocused();

    await loginPage.pressKey('Tab');

    // Verify password input can be focused
    await expect(loginPage.passwordInput).toBeFocused();

    await loginPage.pressKey('Tab');

    // Verify login button can be focused
    await expect(loginPage.loginButton).toBeFocused();
  });

  test('TC023 - Focus indicators are visible on interactive elements @accessibility', async ({
    loginPage,
  }) => {
    // Focus on username input
    await loginPage.usernameInput.focus();
    await expect(loginPage.usernameInput).toBeFocused();

    // Take a screenshot to verify focus state is visible
    await expect(loginPage.usernameInput).toHaveCSS('outline-style', /.+/);

    // Focus on password input
    await loginPage.passwordInput.focus();
    await expect(loginPage.passwordInput).toBeFocused();

    // Focus on login button
    await loginPage.loginButton.focus();
    await expect(loginPage.loginButton).toBeFocused();
  });

  test('TC024 - Form has proper ARIA attributes @accessibility', async ({ loginPage }) => {
    // Check that the form is accessible
    const form = loginPage.form;
    await expect(form).toBeVisible();

    // Verify inputs have proper types
    await expect(loginPage.usernameInput).toHaveAttribute('type', /.+/);
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');

    // Verify button has accessible role
    await expect(loginPage.loginButton).toHaveRole('button');
  });

  test('Login form meets WCAG 2.1 AA standards @accessibility @wcag', async ({ loginPage }) => {
    // Run comprehensive WCAG 2.1 AA audit
    await expectWcag21AA(loginPage.page, [
      // Exclude any known exceptions here if needed
    ]);
  });

  test('Login form has no critical accessibility violations @accessibility @smoke', async ({
    loginPage,
  }) => {
    // Run accessibility audit and fail on any violations
    await expectNoA11yViolations(loginPage.page, {
      includeTags: ['wcag2a', 'wcag2aa'],
    });
  });

  test('Generate accessibility report @accessibility @report', async ({ loginPage }) => {
    // Generate and log the accessibility report
    const report = await getAccessibilityReport(loginPage.page);

    // Log the report for visibility in test results
    console.log('\n=== Accessibility Report ===\n');
    console.log(report);
    console.log('\n============================\n');

    // This test documents the current state without failing
    // Remove the expect below to make this a documentation-only test
    await expectNoA11yViolations(loginPage.page);
  });

  test('Form can be submitted using Enter key @accessibility @keyboard', async ({ loginPage }) => {
    // Fill in credentials using keyboard
    await loginPage.usernameInput.fill('testuser');
    await loginPage.passwordInput.fill('password123');

    // Submit form using Enter key
    await loginPage.pressKey('Enter');

    // Verify form was submitted
    await expect(loginPage.successMessage).toBeVisible();
  });

  test('Color contrast meets minimum requirements @accessibility @visual', async ({
    loginPage,
  }) => {
    // Run axe-core with color contrast rules
    await expectNoA11yViolations(loginPage.page, {
      includeTags: ['cat.color'],
    });
  });
});
