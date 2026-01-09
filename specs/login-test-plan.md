# Login Functionality Test Plan

## Target Application
**URL:** https://testerbud.com/practice-login-form

---

## 1. Objectives

- Verify successful login with valid credentials
- Validate error handling for invalid login attempts
- Ensure proper input field validation
- Confirm password masking functionality
- Test security measures against common vulnerabilities
- Assess UI/UX and accessibility compliance

---

## 2. Scope

| Area | In Scope | Out of Scope |
|------|----------|--------------|
| Functional Testing | ✅ Login form validation, authentication flow | Password recovery, registration |
| Security Testing | ✅ SQL injection, XSS prevention | Penetration testing |
| Usability Testing | ✅ Responsive design, keyboard navigation | Full accessibility audit |
| Cross-browser Testing | ✅ Chrome, Firefox, Safari, Edge | Legacy browsers |

---

## 3. Test Environment

| Component | Details |
|-----------|---------|
| **OS** | Windows 10, macOS, Linux |
| **Browsers** | Chrome (latest), Firefox (latest), Safari, Edge |
| **Test Framework** | Playwright |
| **Network** | Standard internet connection |

---

## 4. Test Data

### Valid Credentials
| Field | Value |
|-------|-------|
| Username | `testuser` |
| Password | `password123` |

### Invalid Test Data
| Scenario | Username | Password |
|----------|----------|----------|
| Invalid username | `wronguser` | `password123` |
| Invalid password | `testuser` | `wrongpass` |
| Empty username | ` ` | `password123` |
| Empty password | `testuser` | ` ` |
| Both empty | ` ` | ` ` |

### Boundary Values
| Scenario | Value |
|----------|-------|
| Min length (1 char) | `a` |
| Max length (50+ chars) | `aaaa...` (50 characters) |
| Special characters | `!@#$%^&*()` |
| Unicode characters | `用户名` |

---

## 5. Test Cases

### 5.1 Functional Test Cases

| TC ID | Test Case | Steps | Expected Result | Priority |
|-------|-----------|-------|-----------------|----------|
| TC001 | Successful login with valid credentials | 1. Navigate to login page<br>2. Enter valid username<br>3. Enter valid password<br>4. Click Login | User is authenticated successfully | High |
| TC002 | Login with invalid username | 1. Enter invalid username<br>2. Enter valid password<br>3. Click Login | Error message displayed | High |
| TC003 | Login with invalid password | 1. Enter valid username<br>2. Enter invalid password<br>3. Click Login | Error message displayed | High |
| TC004 | Login with empty username | 1. Leave username empty<br>2. Enter password<br>3. Click Login | Validation error shown | High |
| TC005 | Login with empty password | 1. Enter username<br>2. Leave password empty<br>3. Click Login | Validation error shown | High |
| TC006 | Login with both fields empty | 1. Leave both fields empty<br>2. Click Login | Validation errors shown | Medium |
| TC007 | Password field masking | 1. Type in password field | Characters are masked (••••) | Medium |
| TC008 | Login form field focus | 1. Tab through form fields | Focus moves sequentially | Low |
| TC009 | Enter key submits form | 1. Fill credentials<br>2. Press Enter | Form is submitted | Medium |
| TC010 | Username/password trimming | 1. Enter credentials with leading/trailing spaces<br>2. Submit | Spaces are trimmed before validation | Low |

### 5.2 Security Test Cases

| TC ID | Test Case | Input | Expected Result | Priority |
|-------|-----------|-------|-----------------|----------|
| TC011 | SQL Injection prevention | `' OR '1'='1` | Input rejected/sanitized | Critical |
| TC012 | XSS prevention | `<script>alert('XSS')</script>` | Script not executed | Critical |
| TC013 | Password not in URL | Any password | Password not visible in URL | Critical |
| TC014 | Password field type | N/A | Input type is "password" | High |

### 5.3 UI/UX Test Cases

| TC ID | Test Case | Steps | Expected Result | Priority |
|-------|-----------|-------|-----------------|----------|
| TC015 | Login form visible on page load | 1. Navigate to login page | Form is visible and centered | High |
| TC016 | Responsive design - mobile | 1. Open on mobile viewport | Form adapts to screen size | Medium |
| TC017 | Responsive design - tablet | 1. Open on tablet viewport | Form displays correctly | Medium |
| TC018 | Placeholder text visible | 1. View empty form | Placeholder text guides user | Low |
| TC019 | Error message styling | 1. Trigger error | Error is visually distinct (red) | Medium |
| TC020 | Login button enabled state | 1. View button initially | Button is clickable | Low |

### 5.4 Accessibility Test Cases

| TC ID | Test Case | Steps | Expected Result | Priority |
|-------|-----------|-------|-----------------|----------|
| TC021 | Form labels present | 1. Inspect form elements | All inputs have associated labels | High |
| TC022 | Keyboard navigation | 1. Tab through form | All elements reachable via keyboard | High |
| TC023 | Focus indicators visible | 1. Tab through form | Focus state is clearly visible | Medium |
| TC024 | ARIA attributes | 1. Inspect form | Proper ARIA labels/roles present | Medium |

---

## 6. Test Execution Priority

1. **Critical:** Security tests (TC011-TC014)
2. **High:** Core functional tests (TC001-TC005), Accessibility (TC021-TC022)
3. **Medium:** Extended functional tests (TC006-TC009), UI tests
4. **Low:** Edge cases and enhancements

---

## 7. Pass/Fail Criteria

- **Pass:** All High and Critical priority test cases pass
- **Conditional Pass:** High/Critical pass, some Medium/Low fail with documented issues
- **Fail:** Any Critical or more than 2 High priority test cases fail

---

## 8. Risks and Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Page structure changes | Tests may break | Use stable selectors, maintain locator strategy |
| Network latency | Flaky tests | Implement proper waits and timeouts |
| Cross-browser inconsistencies | Different behavior | Run tests in multiple browsers |

---

## 9. References

- [Practice Login Form](https://testerbud.com/practice-login-form)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)

