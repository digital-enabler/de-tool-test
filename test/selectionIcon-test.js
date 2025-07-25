const { expect } = require('chai');
const initHomePageSession = require('../helpers/initHomePageSession');
const { By, until } = require('selenium-webdriver');

describe('Selection Icon Test', function () {
  this.timeout(30000);

  let driver;
  let homePage;

  before(async function () {
    const session = await initHomePageSession();
    driver = session.driver;
    homePage = session.homePage;

    //Aspetta che la selection icon sia pronta
    const checkbox = By.id('input-v-4');
    await driver.wait(until.elementLocated(checkbox), 10000);
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('should show delete icon after clicking the checkbox', async function () {
    const checkbox = await driver.findElement(By.id('input-v-4'));
    await checkbox.click();
    
    const isVisible = await homePage.isDeleteIconVisible();
    expect(isVisible).to.be.true;
  });
});

