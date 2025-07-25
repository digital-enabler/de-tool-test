const { expect } = require('chai');
const initHomePageSession = require('../helpers/initHomePageSession');

describe('Row Selection Checkbox Test', function () {
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

  it('should click on a row checkbox and show delete icon', async function () {
    await homePage.clickFirstRowCheckbox();

    const isVisible = await homePage.isDeleteIconVisible();
    expect(isVisible).to.be.true;
  });
});