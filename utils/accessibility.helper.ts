import AxeBuilder from '@axe-core/playwright';
import { Page, expect } from '@playwright/test';

/**
 * Accessibility Testing Helper
 * Provides utilities for running accessibility audits using axe-core
 */

export interface A11yViolation {
  id: string;
  impact: string;
  description: string;
  helpUrl: string;
  nodes: number;
}

export interface A11yOptions {
  /** Specific tags to include (e.g., 'wcag2a', 'wcag2aa', 'wcag21aa') */
  includeTags?: string[];
  /** Specific tags to exclude */
  excludeTags?: string[];
  /** CSS selectors to exclude from testing */
  excludeSelectors?: string[];
  /** Specific rules to disable */
  disableRules?: string[];
}

/**
 * Run accessibility audit on the current page
 * @param page - Playwright page object
 * @param options - Configuration options for the audit
 * @returns Array of violations found
 */
export async function runAccessibilityAudit(
  page: Page,
  options: A11yOptions = {}
): Promise<A11yViolation[]> {
  let builder = new AxeBuilder({ page });

  // Apply tag filters
  if (options.includeTags?.length) {
    builder = builder.withTags(options.includeTags);
  }

  // Exclude specific selectors
  if (options.excludeSelectors?.length) {
    builder = builder.exclude(options.excludeSelectors);
  }

  // Disable specific rules
  if (options.disableRules?.length) {
    builder = builder.disableRules(options.disableRules);
  }

  const results = await builder.analyze();

  return results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact || 'unknown',
    description: violation.description,
    helpUrl: violation.helpUrl,
    nodes: violation.nodes.length,
  }));
}

/**
 * Assert that the page has no accessibility violations
 * @param page - Playwright page object
 * @param options - Configuration options for the audit
 */
export async function expectNoA11yViolations(page: Page, options: A11yOptions = {}): Promise<void> {
  const violations = await runAccessibilityAudit(page, options);

  if (violations.length > 0) {
    const violationDetails = violations
      .map((v) => `  - [${v.impact.toUpperCase()}] ${v.id}: ${v.description} (${v.nodes} nodes)`)
      .join('\n');

    throw new Error(`Found ${violations.length} accessibility violation(s):\n${violationDetails}`);
  }
}

/**
 * Assert that the page meets WCAG 2.1 AA standards
 * @param page - Playwright page object
 * @param excludeSelectors - Optional selectors to exclude from testing
 */
export async function expectWcag21AA(page: Page, excludeSelectors?: string[]): Promise<void> {
  await expectNoA11yViolations(page, {
    includeTags: ['wcag2a', 'wcag2aa', 'wcag21aa'],
    excludeSelectors,
  });
}

/**
 * Get a formatted accessibility report
 * @param page - Playwright page object
 * @param options - Configuration options for the audit
 * @returns Formatted report string
 */
export async function getAccessibilityReport(
  page: Page,
  options: A11yOptions = {}
): Promise<string> {
  const violations = await runAccessibilityAudit(page, options);

  if (violations.length === 0) {
    return '✅ No accessibility violations found!';
  }

  const lines = [
    `❌ Found ${violations.length} accessibility violation(s):`,
    '',
    ...violations.map((v, i) => [
      `${i + 1}. [${v.impact.toUpperCase()}] ${v.id}`,
      `   Description: ${v.description}`,
      `   Affected nodes: ${v.nodes}`,
      `   Help: ${v.helpUrl}`,
      '',
    ]).flat(),
  ];

  return lines.join('\n');
}

/**
 * Check if an element has proper accessible name
 * @param page - Playwright page object
 * @param selector - CSS selector for the element
 */
export async function expectAccessibleName(page: Page, selector: string): Promise<void> {
  const element = page.locator(selector);
  await expect(element).toBeVisible();

  // Check for aria-label, aria-labelledby, or visible text
  const hasAriaLabel = await element.getAttribute('aria-label');
  const hasAriaLabelledBy = await element.getAttribute('aria-labelledby');
  const hasText = await element.textContent();

  const hasAccessibleName = hasAriaLabel || hasAriaLabelledBy || (hasText && hasText.trim());

  expect(
    hasAccessibleName,
    `Element "${selector}" should have an accessible name (aria-label, aria-labelledby, or text content)`
  ).toBeTruthy();
}

/**
 * Verify keyboard navigation works for interactive elements
 * @param page - Playwright page object
 * @param selectors - Array of selectors in expected tab order
 */
export async function verifyKeyboardNavigation(page: Page, selectors: string[]): Promise<void> {
  for (const selector of selectors) {
    await page.keyboard.press('Tab');
    const focused = page.locator(selector);
    await expect(focused).toBeFocused();
  }
}

