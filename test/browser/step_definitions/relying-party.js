const { Then } = require("@cucumber/cucumber");

const { RelyingPartyPage } = require("../pages");
const { expect } = require("chai");

Then(/^they should be redirected as a success to (.*)$/, async function (rpEndpoint) {
  const rpPage = new RelyingPartyPage(this.page);

  await expect(await rpPage.isCurrentPage()).to.be.true;
  await expect(this.redirectChain.length).to.equal(4)
  await expect(this.redirectChain[0]).to.contain("/resume");
  await expect(this.redirectChain[1]).to.contain("/authorize");
  await expect(this.redirectChain[2]).to.contain("/callback");
  await expect(this.redirectChain[3]).to.contain(rpEndpoint);

});

Then("they should be redirected as an error", function () {
  const rpPage = new RelyingPartyPage(this.page);

  expect(rpPage.isRelyingPartyServer()).to.be.true;

  expect(rpPage.hasErrorQueryParams()).to.be.true;
});
