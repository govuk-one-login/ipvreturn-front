const { Then, When } = require("@cucumber/cucumber");

When(
  "they have completed login",
  {
    timeout: 10 * 1000,
  },
  async function () { },
);

Then("they should be redirected to the callback page", async function () {
  await this.page.waitForLoadState("networkidle");
});

Then(
  "they should be redirected to the RP with success params",
  async function () {
    await this.page.waitForLoadState("networkidle");
  },
);