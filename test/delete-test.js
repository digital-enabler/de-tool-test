const { expect } = require("chai");
const initHomePageSession = require("../helpers/initHomePageSession");

describe("Delete Rule Test", function () {
  this.timeout(30000);

  let driver;
  let homePage;

  before(async function () {
    const session = await initHomePageSession();
    driver = session.driver;
    homePage = session.homePage;
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it("should delete the first rule using the menu option", async function () {
    // Named after the first rule
    const originalName = await homePage.getFirstRowName();

    // Click the three dots menu
    await homePage.clickFirstRowThreeDotMenu();
    await driver.sleep(1500); 

    // Click the “delete” option
    await homePage.clickMenuOptionByText("delete");
    await driver.sleep(1500); 

    // Click the “DELETE” button in the modal
    await homePage.clickButtonByText("DELETE");
    await driver.sleep(2000); 

    // Does a search to verify that the rule is no longer there
    await homePage.searchForAllowingNoResults(originalName);
    await driver.sleep(1000);
    const results = await homePage.getSearchResultsText();

    expect(results.length).to.equal(0);
  });
});
