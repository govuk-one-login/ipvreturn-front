const { Before, BeforeAll, AfterAll, After } = require("@cucumber/cucumber");
const { chromium } = require("playwright");
const { setDefaultTimeout } = require("@cucumber/cucumber");
const axios = require("axios");

setDefaultTimeout(10 * 1000);

BeforeAll(async function () {
  require("dotenv").config();
  // Browsers are expensive in Playwright so only create 1
  global.browser = process.env.GITHUB_ACTIONS
    ? await chromium.launch()
    : await chromium.launch({
        // Set headless to false to watch test runs
        headless: false,
        // Slow so we can see things happening
        slowMo: 1000,
      });
});

AfterAll(async function () {
  await global.browser.close();
});

// Create a new test context and page per scenario
Before(async function ({ gherkinDocument, pickle }) {
  console.log(`\nRunning: ${pickle.name}`);

  this.redirectChain = [];
  const contextOptions = {};

  const scenarioOnlyTags = gherkinDocument.feature.children
    .filter(feature => feature.scenario.id === pickle.astNodeIds[0])
    .map(child => child.scenario.tags).map(tag => tag[0].name);

  // Existing logic for WireMock scenario header and reset
  const mockApiTag = scenarioOnlyTags.find((tag) => tag.startsWith("@mock-api:"));
  if (mockApiTag) {
    this.SCENARIO_ID_HEADER = mockApiTag.substring(10);
    if (this.SCENARIO_ID_HEADER && process.env.API_BASE_URL) {
      const url =
        process.env.API_BASE_URL +
        `/__reset/${this.SCENARIO_ID_HEADER}`;
      try {
        await axios.get(url);
      } catch (error) {
        console.log(`Warning: Failed to reset mock API: ${error.message}`);
      }
    }
  }

  // Apply scenario ID header if present
  if (this.SCENARIO_ID_HEADER) {
    contextOptions.extraHTTPHeaders = {
      ...contextOptions.extraHTTPHeaders, // Preserve any existing headers
      "x-scenario-id": this.SCENARIO_ID_HEADER
    };
  }

  this.context = await global.browser.newContext(contextOptions);
  console.log(`SCENARIO: ${pickle.name}`);

  this.page = await this.context.newPage();
  this.page.on('request', request => {
    this.redirectChain.push(request.url());
  });

});

// Cleanup after each scenario
After(async function () {
  await this.page.close();
  await this.context.close();
});

