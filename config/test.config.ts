import * as path from 'path';

/**
 * Attempt to load dotenv if available
 * Install with: npm install dotenv --save-dev
 */
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
} catch {
  // dotenv not installed, using process.env directly
}

/**
 * Environment Types
 */
export type Environment = 'dev' | 'staging' | 'prod';

/**
 * Environment-specific configuration
 */
interface EnvironmentConfig {
  baseUrl: string;
  apiUrl: string;
  timeout: number;
}

const environments: Record<Environment, EnvironmentConfig> = {
  dev: {
    baseUrl: 'https://dev.testerbud.com',
    apiUrl: 'https://api-dev.testerbud.com',
    timeout: 30000,
  },
  staging: {
    baseUrl: 'https://testerbud.com',
    apiUrl: 'https://api.testerbud.com',
    timeout: 60000,
  },
  prod: {
    baseUrl: 'https://testerbud.com',
    apiUrl: 'https://api.testerbud.com',
    timeout: 60000,
  },
};

/**
 * Get current environment from env variable or default to staging
 */
function getEnvironment(): Environment {
  const env = process.env.TEST_ENV as Environment;
  if (env && environments[env]) {
    return env;
  }
  return 'staging';
}

const currentEnv = getEnvironment();
const envConfig = environments[currentEnv];

/**
 * Test Configuration
 * Centralized configuration for URLs, test data, and environment settings
 */
export const config = {
  // Current environment
  env: currentEnv,

  // Environment-specific URLs
  baseUrl: process.env.BASE_URL || envConfig.baseUrl,
  apiUrl: envConfig.apiUrl,

  // Page URLs
  urls: {
    login: `${process.env.BASE_URL || envConfig.baseUrl}/practice-login-form`,
    home: `${process.env.BASE_URL || envConfig.baseUrl}`,
  },

  // Timeouts
  timeouts: {
    default: envConfig.timeout,
    short: 5000,
    long: 120000,
    navigation: 30000,
    action: 10000,
  },

  // Test Data
  testData: {
    validCredentials: {
      username: process.env.TEST_USERNAME || 'user@premiumbank.com',
      password: process.env.TEST_PASSWORD || 'Bank@123',
    },
    invalidCredentials: {
      wrongUsername: 'wronguser@premiumbank.com',
      wrongPassword: 'wrongpass',
    },
  },

  // Feature flags
  features: {
    debug: process.env.DEBUG === 'true',
    verboseLogging: process.env.VERBOSE_LOGGING === 'true',
    isCI: process.env.CI === 'true',
  },
};

/**
 * Export environment helpers
 */
export const isCI = (): boolean => config.features.isCI;
export const isDebug = (): boolean => config.features.debug;
export const getBaseUrl = (): string => config.baseUrl;
