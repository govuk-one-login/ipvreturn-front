@success @browser @QualityGateIntegrationTest @QualityGateRegressionTest @QualityGateStackTest

Feature: IPV Return service - E2E

@mock-api:ipr-login-pending
Scenario: IPV return service - Should return to dashboard following unsuccessful call
    Given Authenticatable Anita is using the system
    When they have completed a F2F journey
    Then they should be redirected to the authorizeUrl
    Then they should be redirected to the callback page
    Then they should be redirected as a success to https://home.staging.account.gov.uk

@mock-api:ipr-login-no-session
Scenario: IPV return service - Should return to dashboard following no session found
    Given Authenticatable Anita is using the system
    When they have completed a F2F journey
    Then they should be redirected to the authorizeUrl
    Then they should be redirected to the callback page
    Then they should be redirected as a success to https://home.staging.account.gov.uk