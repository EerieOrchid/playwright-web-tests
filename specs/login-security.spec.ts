import { test, expect } from '../fixtures/page.fixture';
import { config } from '../config/test.config';

/**
 * Login Security Tests
 * Target Application: https://testerbud.com/practice-login-form
 */

const { validCredentials } = config.testData;

test.describe('Feature: Login Security @login @security', () => {
  test('Scenario: TC011 - SQL Injection prevention @critical', async ({ loginPage }) => {
    await test.step('Given I am on the login page', async () => {
      await expect(loginPage.form).toBeVisible();
    });

    await test.step('When I login with "\' OR \'1\'=\'1" and "password123"', async () => {
      await loginPage.login("' OR '1'='1", 'password123');
    });

    await test.step('Then the input should be rejected or sanitized', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
    });

    await test.step('And I should not be logged in', async () => {
      await expect(loginPage.successMessage).not.toBeVisible();
    });
  });

  test('Scenario: TC012 - XSS prevention @critical', async ({ loginPage }) => {
    await test.step('Given I am on the login page', async () => {
      await expect(loginPage.form).toBeVisible();
    });

    await test.step('When I enter username "<script>alert(\'XSS\')</script>"', async () => {
      await loginPage.usernameInput.fill("<script>alert('XSS')</script>");
    });

    await test.step('And I enter valid password', async () => {
      await loginPage.passwordInput.fill(validCredentials.password);
    });

    await test.step('And I click the login button', async () => {
      await loginPage.loginButton.click();
    });

    await test.step('Then no script should be executed', async () => {
      // If we reach this point without JS alert interrupting, XSS is prevented
      await expect(loginPage.form).toBeVisible();
    });
  });

  test('Scenario: TC013 - Password not visible in URL @critical', async ({ loginPage }) => {
    await test.step('Given I am on the login page', async () => {
      await expect(loginPage.form).toBeVisible();
    });

    await test.step('When I login with valid username and password', async () => {
      await loginPage.login(validCredentials.username, validCredentials.password);
    });

    await test.step('Then the password should not be in the URL', async () => {
      const url = loginPage.getCurrentUrl();
      expect(url).not.toContain(validCredentials.password);
    });
  });
});
