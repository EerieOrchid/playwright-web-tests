import { test, expect } from '../fixtures/page.fixture';
import { config } from '../config/test.config';

/**
 * Login Functionality Tests
 * Target Application: https://testerbud.com/practice-login-form
 */

const { validCredentials, invalidCredentials } = config.testData;

test.describe('Feature: Login Functionality @login @functional', () => {
  test('Scenario: TC001 - Successful login with valid credentials @positive @high', async ({ loginPage }) => {
    await test.step('Given I am on the login page', async () => {
      await expect(loginPage.form).toBeVisible();
    });

    await test.step('When I login with valid username and password', async () => {
      await loginPage.login(validCredentials.username, validCredentials.password);
    });

    await test.step('Then I should see a success message', async () => {
      await expect(loginPage.successMessage).toBeVisible();
    });
  });

  test('Scenario: TC002 - Login with invalid username @negative @high', async ({ loginPage }) => {
    await test.step('Given I am on the login page', async () => {
      await expect(loginPage.form).toBeVisible();
    });

    await test.step('When I login with invalid username and a valid password', async () => {
      await loginPage.login(invalidCredentials.wrongUsername, validCredentials.password);
    });

    await test.step('Then I should see an error message', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
    });
  });

  test('Scenario: TC003 - Login with invalid password @negative @high', async ({ loginPage }) => {
    await test.step('Given I am on the login page', async () => {
      await expect(loginPage.form).toBeVisible();
    });

    await test.step('When I login with a valid username and an invalid password', async () => {
      await loginPage.login(validCredentials.username, invalidCredentials.wrongPassword);
    });

    await test.step('Then I should see an error message', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
    });
  });

  test('Scenario: TC004 - Login with empty username @negative @high', async ({ loginPage }) => {
    await test.step('Given I am on the login page', async () => {
      await expect(loginPage.form).toBeVisible();
    });

    await test.step('When I login with empty username', async () => {
      await loginPage.login('', validCredentials.password);
    });

    await test.step('Then I should see an error message', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
    });
  });

  test('Scenario: TC005 - Login with empty password @negative @high', async ({ loginPage }) => {
    await test.step('Given I am on the login page', async () => {
      await expect(loginPage.form).toBeVisible();
    });

    await test.step('When I login with empty password', async () => {
      await loginPage.login(validCredentials.username, '');
    });

    await test.step('Then I should see an error message', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
    });
  });

  test('Scenario: TC006 - Login with empty username and password @negative @medium', async ({ loginPage }) => {
    await test.step('Given I am on the login page', async () => {
      await expect(loginPage.form).toBeVisible();
    });

    await test.step('When I click the login button without entering username and password', async () => {
      await loginPage.loginButton.click();
    });

    await test.step('Then I should see an error message', async () => {
      await expect(loginPage.errorMessage).toBeVisible();
    });
  });

  test('Scenario: TC007 - Password field is masked @medium', async ({ loginPage }) => {
    await test.step('Given I am on the login page', async () => {
      await expect(loginPage.form).toBeVisible();
    });

    await test.step('Then the password field should be masked', async () => {
      await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    });
  });

  test('Scenario: TC008 - Tab navigation through form fields @low', async ({ loginPage }) => {
    await test.step('Given I am on the login page', async () => {
      await expect(loginPage.form).toBeVisible();
    });

    await test.step('When I focus on the username field', async () => {
      await loginPage.usernameInput.focus();
    });

    await test.step('And I press Tab', async () => {
      await loginPage.pressKey('Tab');
    });

    await test.step('Then the password field should be focused', async () => {
      await expect(loginPage.passwordInput).toBeFocused();
    });

    await test.step('When I tab through remaining form elements to reach login button', async () => {
      // Tab order: Password -> Remember me checkbox -> Forgot password link -> Sign in button
      await loginPage.pressKey('Tab'); // Remember me checkbox
      await loginPage.pressKey('Tab'); // Forgot password link
      await loginPage.pressKey('Tab'); // Sign in button
    });

    await test.step('Then the login button should be focused', async () => {
      await expect(loginPage.loginButton).toBeFocused();
    });
  });

  test('Scenario: TC009 - Submit form with Enter key @medium', async ({ loginPage }) => {
    await test.step('Given I am on the login page', async () => {
      await expect(loginPage.form).toBeVisible();
    });

    await test.step('When I enter a valid username', async () => {
      await loginPage.usernameInput.fill(validCredentials.username);
    });

    await test.step('And I enter a valid password', async () => {
      await loginPage.passwordInput.fill(validCredentials.password);
    });

    await test.step('And I press Enter', async () => {
      await loginPage.pressKey('Enter');
    });

    await test.step('Then I should see a success message', async () => {
      await expect(loginPage.successMessage).toBeVisible();
    });
  });
});
