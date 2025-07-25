const { loginWithValidCredentials } = require('./auth');
const { By, until } = require('selenium-webdriver');
const HomePage = require('../pages/home-page');

async function initHomePageSession() {
  const session = await loginWithValidCredentials();
  const driver = session.driver;

  await driver.get('https://idm.digital-enabler.eng.it/auth/realms/avant/protocol/openid-connect/auth?response_type=code&client_id=rule-app&redirect_uri=https://rm-middleware-api.core.digital-enabler.eng.it/api/v1/avant/auth/callback');

  await driver.executeScript(`localStorage.setItem('lang', 'en');`);
  await driver.navigate().refresh();

  const homePage = new HomePage(driver);

  //controllo per verificare che la pagina sia caricata correttamente controllando la presenza del menu a 3 pallini
  const readyIndicator = By.css('.mdi-dots-vertical');
  await driver.wait(until.elementLocated(readyIndicator), 10000);
  const menuDots = await driver.findElement(readyIndicator);
  await driver.wait(until.elementIsVisible(menuDots), 5000);

  return { driver, homePage };
}

module.exports = initHomePageSession;
