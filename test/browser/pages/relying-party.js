module.exports = class PlaywrightDevPage {
  /**
   * @param {import('@playwright/test').Page} page
   *
   */

  constructor(page) {
    this.page = page;
    this.path = "/rp";
    this.base = `http://${process.env.FRONT_END_CUSTOM_DOMAIN}:${process.env.PORT}`    
  }

  async goto() {
    await this.page.goto(this.base + this.path);
  }

  async isCurrentPage() {
    const url = this.page.url();
    return url === this.base + this.path || process.env.ACCOUNTS_DASHBOARD === url
  }

  hasErrorQueryParams() {
    const { searchParams } = new URL(this.page.url());

    return (
      searchParams.get("error") === "server_error" &&
      searchParams.get("error_description") === "gateway"
    );
  }
};
