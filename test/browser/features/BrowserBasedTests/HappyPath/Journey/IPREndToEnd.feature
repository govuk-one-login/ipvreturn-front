@success @browser @QualityGateIntegrationTest @QualityGateRegressionTest @QualityGateStackTest

Feature: IPV Return service - E2E

@mock-api:ipr-login-success 
Scenario: IPV return service - Should return to RP following successful journey
    Given Authenticatable Anita is using the system
    When they have completed a F2F journey
    Then they should be redirected to the authorizeUrl
    Then they should be redirected to the callback page
    Then they should be redirected as a success to http://localhost:8080/rp