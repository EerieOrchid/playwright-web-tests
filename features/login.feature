@login
Feature: Login Functionality
  As a user
  I want to login to the application
  So that I can access my account

  Background:
    Given I am on the login page

  # ==================== 5.1 Functional Test Cases ====================

  @TC001 @functional @positive @high
  Scenario: Successful login with valid credentials
    When I login with valid username and password
    Then I should see a success message

  @TC002 @functional @negative @high
  Scenario: Login with invalid username
    When I login with invalid username and a valid password
    Then I should see an error message

  @TC003 @functional @negative @high
  Scenario: Login with invalid password
    When I login with a valid username and a invalid password
    Then I should see an error message

  @TC004 @functional @negative @high
  Scenario: Login with empty username
    When I login with empty username
    Then I should see an error message

  @TC005 @functional @negative @high
  Scenario: Login with empty password
    When I login with enpty password
    Then I should see an error message

  @TC006 @functional @negative @medium
  Scenario: Login with empty username and password
    When I click the login button without entering username and password
    Then I should see an error message

  @TC007 @functional @medium
  Scenario: Password field is masked
    Then the password field should be masked

  @TC008 @functional @low
  Scenario: Tab navigation through form fields
    When I focus on the username field
    And I press Tab
    Then the password field should be focused
    When I press Tab
    Then the login button should be focused

  @TC009 @functional @medium
  Scenario: Submit form with Enter key
    When I enter a valid username
    And I enter a valid password
    And I press Enter
    Then I should see a success message

  # ==================== 5.2 Security Test Cases ====================

  @TC011 @security @critical
  Scenario: SQL Injection prevention
    When I login with "' OR '1'='1" and "password123"
    Then the input should be rejected or sanitized
    And I should not be logged in

  @TC012 @security @critical
  Scenario: XSS prevention
    When I enter username "<script>alert('XSS')</script>"
    And I enter valid password
    And I click the login button
    Then no script should be executed

  @TC013 @security @critical
  Scenario: Password not visible in URL
    When I login with valid username and password
    Then the password should not be in the URL

  # ==================== 5.4 Accessibility Test Cases ====================

  @TC021 @a11y @high
  Scenario: Form labels are present
    Then all input fields should have associated labels

  @TC022 @a11y @high
  Scenario: Keyboard navigation
    Then all form elements should be reachable via keyboard

  @TC023 @a11y @medium
  Scenario: Focus indicators are visible
    When I tab through form fields
    Then focus state should be clearly visible

  @TC024 @a11y @medium
  Scenario: ARIA attributes are present
    Then the form should have proper ARIA labels and roles

  # ==================== 5.5 Visual Test Cases ====================

  @VIS001 @visual @high
  Scenario: Login form matches baseline screenshot
    Then the login form should match the baseline screenshot

  # ==================== Data-Driven Scenarios ====================

  @functional @negative @data-driven
  Scenario Outline: Login with invalid credentials
    When I login with "<username>" and "<password>"
    Then I should see an error message

    Examples:
      | username  | password    |
      | wronguser | password123 |
      | testuser  | wrongpass   |
      | wronguser | wrongpass   |

  @security @data-driven @critical
  Scenario Outline: Security input validation
    When I enter username "<malicious_input>"
    And I click the login button
    Then the input should be sanitized

    Examples:
      | malicious_input                    |
      | ' OR '1'='1                        |
      | <script>alert('XSS')</script>      |
      | '; DROP TABLE users; --            |
      | <img src=x onerror=alert('XSS')>   |
