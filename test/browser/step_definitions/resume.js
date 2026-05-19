const { Given, Then, When } = require("@cucumber/cucumber");

const { ResumePage, DiscoveryPage } = require("../pages");

Given(
  /^([^"]*) is using the system$/,
  { timeout: 2 * 5000 },
  async function (name) {
    const resumePage = new ResumePage(this.page);

    await resumePage.goto();
  },
);

When(
  "they have completed a F2F journey",
  {
    timeout: 10 * 1000,
  },
  async function () { },
);

Then("they should be redirected to the authorizeUrl", async function () {
  const discoveryPage = new DiscoveryPage(await this.page);
  await this.page.waitForLoadState("networkidle");
});

