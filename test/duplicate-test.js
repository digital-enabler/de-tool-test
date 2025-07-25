const { expect } = require("chai");
const initHomePageSession = require("../helpers/initHomePageSession");

describe("Duplicate Menu Option Test", function () {
  this.timeout(40000);

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

  it("should duplicate the first rule using the menu options", async function () {
    const originalName = await homePage.getFirstRowName();

    // Click the three dots in the first row to open the menu
    await homePage.clickFirstRowThreeDotMenu();
    await driver.sleep(1500);

    // Click 'duplicate' option
    await homePage.clickMenuOptionByText("duplicate");

    // Click the series of buttons to complete the duplication
    await homePage.clickButtonByText("DUPLICATE");
    await driver.sleep(1500);
    await homePage.clickButtonByText("CONTINUE");
    await driver.sleep(1500);
    await homePage.clickButtonByText("CONTINUE");
    await driver.sleep(1500);
    await homePage.clickButtonByText("CONTINUE");
    await driver.sleep(1500);
    await homePage.clickButtonByText("SAVE");

    await driver.sleep(5000);

    // Search for the original name in the search bar
    await homePage.searchFor(originalName);

    // Take the search results and check that there is at least one duplicate
    const results = await homePage.getSearchResultsText();
    const foundDuplicate = results.some(
      (name) =>
        name.toLowerCase().includes(originalName.toLowerCase()) &&
        name.toLowerCase() !== originalName.toLowerCase()
    );

    expect(foundDuplicate).to.be.true;
  });
});
