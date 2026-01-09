# Playwright Test Automation Framework

A comprehensive end-to-end test automation framework built with **Playwright** and **TypeScript**, featuring functional, security, accessibility, and visual regression testing capabilities.

## 🎯 Overview

This framework demonstrates modern test automation best practices for testing web applications. It targets the [TesterBud Practice Login Form](https://testerbud.com/practice-login-form) as a sample application.

### Key Features

- ✅ **Cross-browser Testing** - Chromium, Firefox, WebKit, and mobile viewports
- ✅ **Page Object Model** - Clean separation of test logic and page interactions
- ✅ **Custom Fixtures** - Reusable test setup with automatic page navigation
- ✅ **Accessibility Testing** - WCAG 2.1 AA compliance checks using axe-core
- ✅ **Visual Regression** - Screenshot comparison for UI consistency
- ✅ **Security Testing** - SQL injection and XSS prevention validation
- ✅ **BDD-style Scenarios** - Gherkin feature files for documentation
- ✅ **Rich Reporting** - Playwright HTML reports and Allure integration
- ✅ **Environment Management** - Multi-environment configuration support

## 📁 Project Structure

```
├── config/
│   └── test.config.ts        # Centralized test configuration
├── features/
│   └── login.feature         # BDD feature files (Gherkin)
├── fixtures/
│   └── page.fixture.ts       # Custom Playwright fixtures
├── pages/
│   ├── base.page.ts          # Abstract base page class
│   ├── login.po.ts           # Login page object
│   └── index.ts              # Page exports
├── specs/
│   ├── login.spec.ts         # Functional tests
│   ├── login-a11y.spec.ts    # Accessibility tests
│   ├── login-security.spec.ts # Security tests
│   ├── login-visual.spec.ts  # Visual regression tests
│   └── login-test-plan.md    # Test plan documentation
├── utils/
│   ├── accessibility.helper.ts # Axe-core helper functions
│   ├── data.factory.ts       # Test data generation
│   ├── logger.ts             # Logging utility
│   └── index.ts              # Utils exports
├── playwright.config.ts      # Playwright configuration
├── package.json
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd demo

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## 🧪 Running Tests

### Basic Commands

```bash
# Run all tests (excluding accessibility)
npm test

# Run all tests including accessibility
npm run test:all

# Run tests with UI mode
npm run test:ui

# Run tests in headed mode
npm run test:headed

# Run tests in debug mode
npm run test:debug
```

### Browser-Specific Testing

```bash
# Run on Chromium only
npm run test:chromium

# Run on Firefox only
npm run test:firefox

# Run on WebKit only
npm run test:webkit

# Run on mobile viewports
npm run test:mobile
```

### Test Categories

```bash
# Run accessibility tests only
npm run test:a11y

# Run by tag
npx playwright test --grep @functional
npx playwright test --grep @security
npx playwright test --grep @visual
npx playwright test --grep @high
npx playwright test --grep @critical
```

## 📊 Test Reports

### Playwright HTML Report

```bash
# Generate and open HTML report
npm run report
```

### Allure Reports

```bash
# Generate Allure report
npm run allure:generate

# Open Allure report
npm run allure:open

# Serve Allure results directly
npm run allure:serve
```

## 🏷️ Test Tags

Tests are organized with tags for flexible execution:

| Tag | Description |
|-----|-------------|
| `@login` | Login functionality tests |
| `@functional` | Core functionality tests |
| `@security` | Security-related tests |
| `@accessibility` | Accessibility/a11y tests |
| `@visual` | Visual regression tests |
| `@positive` | Happy path scenarios |
| `@negative` | Error/edge case scenarios |
| `@critical` | Critical priority tests |
| `@high` | High priority tests |
| `@medium` | Medium priority tests |
| `@low` | Low priority tests |

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `TEST_ENV` | Environment (dev/staging/prod) | `staging` |
| `BASE_URL` | Override base URL | Environment-specific |
| `TEST_USERNAME` | Test user username | `user@premiumbank.com` |
| `TEST_PASSWORD` | Test user password | `Bank@123` |
| `CI` | CI environment flag | `false` |
| `DEBUG` | Enable debug logging | `false` |

### Test Environments

```bash
# Run tests against different environments
TEST_ENV=dev npm test
TEST_ENV=staging npm test
TEST_ENV=prod npm test
```

## 📝 Test Specifications

### Functional Tests (`login.spec.ts`)
- ✅ Successful login with valid credentials
- ✅ Login with invalid username/password
- ✅ Empty field validation
- ✅ Password masking verification
- ✅ Tab navigation through form
- ✅ Form submission with Enter key

### Security Tests (`login-security.spec.ts`)
- 🔒 SQL Injection prevention
- 🔒 XSS attack prevention
- 🔒 Password not visible in URL

### Accessibility Tests (`login-a11y.spec.ts`)
- ♿ Form labels association
- ♿ Keyboard navigation
- ♿ Focus indicators visibility
- ♿ ARIA attributes validation
- ♿ WCAG 2.1 AA compliance
- ♿ Color contrast requirements

### Visual Tests (`login-visual.spec.ts`)
- 📸 Login form baseline screenshot comparison

## 🛠️ Code Quality

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting
npm run format:check

# TypeScript type checking
npm run typecheck

# Run all checks (CI)
npm run ci
```

## 🔄 Visual Regression Testing

### Update Baseline Screenshots

```bash
npx playwright test login-visual.spec.ts --update-snapshots
```

Baseline screenshots are stored in:
```
specs/login-visual.spec.ts-snapshots/
```

## 🏗️ Architecture

### Page Object Model

The framework uses the Page Object Model pattern:

```typescript
// pages/login.po.ts
export class LoginFormPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

### Custom Fixtures

Page objects are injected via fixtures:

```typescript
// fixtures/page.fixture.ts
export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginFormPage(page);
    await loginPage.navigateTo();
    await use(loginPage);
  },
});
```

### Test Structure

Tests follow BDD-style structure:

```typescript
test('Scenario: TC001 - Successful login @positive @high', async ({ loginPage }) => {
  await test.step('Given I am on the login page', async () => {
    await expect(loginPage.form).toBeVisible();
  });

  await test.step('When I login with valid credentials', async () => {
    await loginPage.login(username, password);
  });

  await test.step('Then I should see a success message', async () => {
    await expect(loginPage.successMessage).toBeVisible();
  });
});
```

## 🤖 CI/CD Integration

The framework is optimized for CI/CD pipelines:

```bash
# Run CI-ready test suite
npm run ci
```

CI-specific behaviors:
- Single worker execution
- 2 retry attempts on failure
- Fail on `test.only` detection
- Screenshots and videos on failure only

### GitHub Actions Example

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run ci
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📚 Dependencies

| Package | Purpose |
|---------|---------|
| `@playwright/test` | Core testing framework |
| `@axe-core/playwright` | Accessibility testing |
| `allure-playwright` | Allure report generation |
| `typescript` | Type safety |
| `eslint` | Code linting |
| `prettier` | Code formatting |

## 📖 Resources

- [Playwright Documentation](https://playwright.dev/)
- [axe-core Documentation](https://www.deque.com/axe/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Allure Framework](https://allurereport.org/)

## 📄 License

ISC

