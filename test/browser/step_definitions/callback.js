const { Then, When } = require("@cucumber/cucumber");

const { RelyingPartyPage, CallbackPage } = require("../pages");

When(
  "they have completed login",
  {
    timeout: 10 * 1000,
  },
  async function () { },
);

Then("they should be redirected to the callback page", async function () {
  const callbackPage = new CallbackPage(await this.page);
  await this.page.waitForLoadState("networkidle");
});

Then(
  "they should be redirected to the RP with success params",
  async function () {
    const relyingPartyPage = new RelyingPartyPage(await this.page);
    await this.page.waitForLoadState("networkidle");
  },
);