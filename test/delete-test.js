const { expect } = require('chai');
const initHomePageSession = require('../helpers/initHomePageSession');

describe('Delete Rule Test', function () {
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

  it('should delete the first rule using the menu option', async function () {
    // 1. Prende il nome della prima regola
    const originalName = await homePage.getFirstRowName();

    // 2. Clicca il menu dei tre puntini
    await homePage.clickFirstRowThreeDotMenu();
    await driver.sleep(1500); // per far aprire il menu

    // 3. Clicca l’opzione "delete"
    await homePage.clickMenuOptionByText('delete');
    await driver.sleep(1500); // per far aprire la modale

    // 4. Clicca il bottone "DELETE" nella modale
    await homePage.clickButtonByText('DELETE');
    await driver.sleep(2000); // per far completare l'operazione

    // 5. Fa una ricerca per verificare che la regola non c'è più
    await homePage.searchForAllowingNoResults(originalName);
    await driver.sleep(1000);
    const results = await homePage.getSearchResultsText();

    expect(results.length).to.equal(0);
  });
});
