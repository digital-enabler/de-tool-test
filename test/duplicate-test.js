const { expect } = require('chai');
const initHomePageSession = require('../helpers/initHomePageSession');

describe('Duplicate Menu Option Test', function () {
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

  it('should duplicate the first rule using the menu options', async function() {
  const originalName = await homePage.getFirstRowName();

  // 1. Clicca i tre puntini della prima riga per aprire il menu
  await homePage.clickFirstRowThreeDotMenu();
  await driver.sleep(1500);

  // 2. Clicca l'opzione 'duplicate'
  await homePage.clickMenuOptionByText('duplicate');

  // 3. Clicca la serie di pulsanti per completare la duplicazione
  await homePage.clickButtonByText('DUPLICATE');
  await driver.sleep(1500);
  await homePage.clickButtonByText('CONTINUE');
  await driver.sleep(1500);
  await homePage.clickButtonByText('CONTINUE');
  await driver.sleep(1500);
  await homePage.clickButtonByText('CONTINUE');
  await driver.sleep(1500);
  await homePage.clickButtonByText('SAVE');

  // 4. Attendi 5 secondi per completare duplicazione
  await driver.sleep(5000);

  // 5. Cerca il nome originale nella searchbar
  await homePage.searchFor(originalName);

  // 6. Prendi i risultati della ricerca e verifica che ci sia almeno un duplicato
  const results = await homePage.getSearchResultsText();
  const foundDuplicate = results.some(name =>
    name.toLowerCase().includes(originalName.toLowerCase()) &&
    name.toLowerCase() !== originalName.toLowerCase()
  );

  expect(foundDuplicate).to.be.true;
});
});