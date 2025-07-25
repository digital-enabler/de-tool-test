const { expect } = require('chai');
const initHomePageSession = require('../helpers/initHomePageSession');

describe('Search Bar Test', function () {
  this.timeout(60000);

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

  it('should search and return results containing the term', async function () {
    const searchTerm = 'prova'; // Sostituire con un termine valido sicuro presente nella rules list

    await homePage.searchFor(searchTerm);
    const results = await homePage.getSearchResultsText();

    //ci si aspetta che il risultato sia più lungo di 0
    expect(results.length).to.be.greaterThan(0);
    results.forEach(text => {
      expect(text.toLowerCase()).to.include(searchTerm.toLowerCase());
    });
  });
});
