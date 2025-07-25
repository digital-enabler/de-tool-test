const { expect } = require('chai');
const initHomePageSession = require('../helpers/initHomePageSession');

describe('Rename Menu Option Test - Step 1', function () {
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

  it('should open three dot menu, rename, and verify with search', async function () {
  await homePage.clickFirstRowThreeDotMenu();
  await homePage.clickMenuOptionByText('rename');

  // Aspetta che il campo rename sia visibile
  await driver.wait(async () => {
    try {
      const input = await driver.findElement(homePage.renameInput);
      return await input.isDisplayed();
    } catch {
      return false;
    }
  }, 5000);

  //questo è quello che bisogna scrivere nel text field del rename
  const newName = 'cambionome';
  await homePage.fillRenameInput(newName);
  await homePage.clickRenameButton();

  await driver.sleep(2000);

  // Cerca con la searchbar
  await homePage.searchFor(newName);
  const results = await homePage.getSearchResultsText();

  // Verifica che almeno un risultato contenga 'cambionome'
  const found = results.some(text => text.toLowerCase().includes(newName.toLowerCase()));
  expect(found).to.be.true;
});
});