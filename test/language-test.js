const { loginWithValidCredentials } = require('../helpers/auth');
const changeLanguage = require('../helpers/language');
const { expect } = require('chai');
const { By, until } = require('selenium-webdriver');

describe('Change Language', function () {
  this.timeout(30000);
  let driver;

  before(async function () {
    const session = await loginWithValidCredentials();
    driver = session.driver;
  });

//metodo per cambiare lingua in inglese e verificare che il titolo sia in inglese cercando 'rules'
it('should change language to English and verify title', async function () {
  await changeLanguage(driver, 'English');
  await driver.sleep(1000);

  const titleSelector = By.css('.text-primary.text-h5.font-weight-bold');
  await driver.wait(until.elementLocated(titleSelector), 5000);
  const titleElement = await driver.findElement(titleSelector);
  await driver.wait(until.elementIsVisible(titleElement), 5000);
  
  await driver.sleep(1000);
  const titleText = await titleElement.getText();
  expect(titleText.toLowerCase()).to.include('rules');
});

//metodo per cambiare lingua in italiano e verificare che il titolo sia in italiano cercando 'regole'
it('should switch back to Italian and verify title', async function () {
  await changeLanguage(driver, 'Italiano');
  await driver.sleep(1000);

  const titleSelector = By.css('.text-primary.text-h5.font-weight-bold');
  await driver.wait(until.elementLocated(titleSelector), 5000);
  const titleElement = await driver.findElement(titleSelector);
  await driver.wait(until.elementIsVisible(titleElement), 5000);

  await driver.sleep(1000);
  const titleText = await titleElement.getText();
  expect(titleText.toLowerCase()).to.include('regole');
});


  after(async function () {
    if (driver) await driver.quit();
  });
});
