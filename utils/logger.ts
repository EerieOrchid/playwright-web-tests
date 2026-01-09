import { test } from '@playwright/test';

/**
 * Log levels for test logging
 */
type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * ANSI color codes for terminal output
 */
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

/**
 * Level-specific styling
 */
const levelStyles: Record<LogLevel, { color: string; icon: string }> = {
  info: { color: colors.cyan, icon: 'ℹ' },
  warn: { color: colors.yellow, icon: '⚠' },
  error: { color: colors.red, icon: '✖' },
  debug: { color: colors.gray, icon: '🔍' },
};

/**
 * Logger configuration
 */
interface LoggerConfig {
  prefix: string;
  showTimestamp: boolean;
  debug: boolean;
  colorize: boolean;
}

/**
 * Test Logger Class
 * Provides structured logging with Allure integration
 */
class TestLogger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      prefix: config.prefix ?? 'TEST',
      showTimestamp: config.showTimestamp ?? true,
      debug: config.debug ?? process.env.VERBOSE_LOGGING === 'true',
      colorize: config.colorize ?? true,
    };
  }

  /**
   * Format log message
   */
  private format(level: LogLevel, message: string, data?: unknown): string {
    const style = levelStyles[level];
    const timestamp = this.config.showTimestamp 
      ? `${colors.gray}[${new Date().toISOString()}]${colors.reset} ` 
      : '';
    const prefix = `${colors.bright}[${this.config.prefix}]${colors.reset}`;
    const levelTag = this.config.colorize 
      ? `${style.color}${style.icon} ${level.toUpperCase()}${colors.reset}`
      : `[${level.toUpperCase()}]`;
    
    let formatted = `${timestamp}${levelTag} ${prefix} ${message}`;
    
    if (data !== undefined) {
      const dataStr = typeof data === 'object' 
        ? JSON.stringify(data, null, 2) 
        : String(data);
      formatted += `\n${colors.dim}${dataStr}${colors.reset}`;
    }
    
    return formatted;
  }

  /**
   * Format plain text (without colors) for Allure
   */
  private formatPlain(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = this.config.showTimestamp 
      ? `[${new Date().toISOString()}] ` 
      : '';
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    return `${timestamp}[${level.toUpperCase()}] [${this.config.prefix}] ${message}${dataStr}`;
  }

  /**
   * Add log to Allure report annotations
   */
  private addToAllure(level: LogLevel, message: string): void {
    try {
      const testInfo = test.info();
      if (testInfo) {
        testInfo.annotations.push({ 
          type: level, 
          description: message 
        });
      }
    } catch {
      // Not in test context, skip Allure annotation
    }
  }

  /**
   * Log informational message
   */
  info(message: string, data?: unknown): void {
    console.log(this.format('info', message, data));
    this.addToAllure('info', this.formatPlain('info', message, data));
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: unknown): void {
    console.warn(this.format('warn', message, data));
    this.addToAllure('warn', this.formatPlain('warn', message, data));
  }

  /**
   * Log error message
   */
  error(message: string, data?: unknown): void {
    console.error(this.format('error', message, data));
    this.addToAllure('error', this.formatPlain('error', message, data));
  }

  /**
   * Log debug message (only when debug mode is enabled)
   */
  debug(message: string, data?: unknown): void {
    if (this.config.debug) {
      console.log(this.format('debug', message, data));
    }
  }

  /**
   * Log a test step (highlighted)
   */
  step(name: string): void {
    const stepMessage = `${colors.magenta}▶${colors.reset} ${colors.bright}${name}${colors.reset}`;
    console.log(`\n${stepMessage}`);
    this.addToAllure('info', `Step: ${name}`);
  }

  /**
   * Log a test action
   */
  action(action: string, target?: string): void {
    const targetStr = target ? ` on "${target}"` : '';
    this.info(`${action}${targetStr}`);
  }

  /**
   * Log a successful assertion
   */
  success(message: string): void {
    const formatted = `${colors.green}✓${colors.reset} ${message}`;
    console.log(formatted);
    this.addToAllure('info', `✓ ${message}`);
  }

  /**
   * Log test start
   */
  testStart(testName: string): void {
    const separator = '─'.repeat(60);
    console.log(`\n${colors.cyan}${separator}${colors.reset}`);
    console.log(`${colors.bright}🧪 TEST: ${testName}${colors.reset}`);
    console.log(`${colors.cyan}${separator}${colors.reset}\n`);
  }

  /**
   * Log test end
   */
  testEnd(testName: string, status: 'passed' | 'failed' | 'skipped'): void {
    const statusColors = {
      passed: colors.green,
      failed: colors.red,
      skipped: colors.yellow,
    };
    const statusIcons = {
      passed: '✓',
      failed: '✖',
      skipped: '⊘',
    };
    const color = statusColors[status];
    const icon = statusIcons[status];
    console.log(`\n${color}${icon} ${status.toUpperCase()}: ${testName}${colors.reset}\n`);
  }

  /**
   * Log navigation event
   */
  navigate(url: string): void {
    this.info(`Navigating to: ${url}`);
  }

  /**
   * Create a child logger with different prefix
   */
  child(prefix: string): TestLogger {
    return new TestLogger({
      ...this.config,
      prefix: `${this.config.prefix}:${prefix}`,
    });
  }

  /**
   * Group related logs
   */
  group(name: string, fn: () => void): void {
    console.group(`${colors.bright}📁 ${name}${colors.reset}`);
    fn();
    console.groupEnd();
  }

  /**
   * Log a table of data
   */
  table(data: Record<string, unknown>[] | object): void {
    console.table(data);
  }
}

/**
 * Default logger instance
 */
export const logger = new TestLogger();

/**
 * Create a custom logger with specific configuration
 */
export const createLogger = (config: Partial<LoggerConfig>): TestLogger => {
  return new TestLogger(config);
};

