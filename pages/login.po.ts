import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { config } from '../config/test.config';

/**
 * Page Object for Login Form
 * Target Application: https://testerbud.com/practice-login-form
 */
export class LoginFormPage extends BasePage {
  readonly url: string = config.urls.login;
  readonly pageName: string = 'Login Page';

  // Locators
  readonly form: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.form = page.locator('form');
    this.usernameInput = page.locator('#formBasicEmail');
    this.passwordInput = page.locator('#formBasicPassword');
    this.loginButton = page.getByRole('button', { name: 'Sign in' });
    // Success message - green alert that appears after successful login
    this.successMessage = page.locator('.alert-success, [role="alert"]:has-text("success"), [role="alert"]:has-text("Welcome")');
    // Error message - red/pink alert that appears after failed login (excludes the demo credentials info box)
    this.errorMessage = page.locator('.alert-danger, [role="alert"]:has-text("required"), [role="alert"]:has-text("Invalid"), [role="alert"]:has-text("incorrect")');
  }

  /**
   * Perform complete login with provided credentials
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
