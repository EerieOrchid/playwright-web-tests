import { Page } from '@playwright/test';
import { logger } from '../utils/logger';

/**
 * Base Page Object
 * Abstract class providing common functionality for all page objects
 */
export abstract class BasePage {
  readonly page: Page;
  
  /**
   * URL path for this page (to be implemented by child classes)
   */
  abstract readonly url: string;

  /**
   * Page name for logging purposes
   */
  abstract readonly pageName: string;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to this page
   */
  async navigateTo(): Promise<void> {
    logger.info(`Navigating to ${this.pageName}`, { url: this.url });
    await this.page.goto(this.url);
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to fully load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    logger.debug(`${this.pageName} loaded`);
  }

  /**
   * Get the current page URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Get the page title
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Reload the current page
   */
  async reload(): Promise<void> {
    logger.info(`Reloading ${this.pageName}`);
    await this.page.reload();
    await this.waitForPageLoad();
  }

  /**
   * Press a keyboard key
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }
}
