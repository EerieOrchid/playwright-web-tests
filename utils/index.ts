/**
 * Utility Exports
 * Central export file for all utilities
 */

// Logger
export { logger, createLogger } from './logger';

// Accessibility helpers
export {
  runAccessibilityAudit,
  expectNoA11yViolations,
  expectWcag21AA,
  getAccessibilityReport,
  expectAccessibleName,
  verifyKeyboardNavigation,
  type A11yViolation,
  type A11yOptions,
} from './accessibility.helper';

// Test data factory
export {
  TestDataFactory,
  generateValidUser,
  getSQLInjectionPayloads,
  getXSSPayloads,
  type UserData,
} from './data.factory';
