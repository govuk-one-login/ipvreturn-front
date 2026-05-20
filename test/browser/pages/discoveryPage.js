module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   */

  constructor(page) {
    this.page = page;
    this.path = "/authorize";
    this.base = `http://${process.env.DISCOVERY_ENDPOINT}`
  }

  async goto() {
    await this.page.goto(this.base + this.path);
  }

  async isCurrentPage() {
    const { pathname } = new URL(this.page.url());
    return pathname === this.path;
  }

};
