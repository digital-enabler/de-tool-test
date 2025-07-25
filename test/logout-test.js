const { loginWithValidCredentials } = require("../helpers/auth");
const logoutUser = require("../helpers/logout");
const { expect } = require("chai");

describe("Logout Test", function () {
  this.timeout(30000);
  let driver;

  before(async function () {
    const session = await loginWithValidCredentials();
    driver = session.driver;
  });

  // we take the url and verify that the url no longer has /rules
  it("should log out and return to login page", async function () {
    await logoutUser(driver);
    const url = await driver.getCurrentUrl();
    expect(url).to.not.equal(
      "https://rules.avant.digital-enabler.eng.it/rules"
    );
  });

  after(async function () {
    if (driver) await driver.quit();
  });
});
