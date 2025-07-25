const { describe, it, before, after, beforeEach } = require('mocha');
const { expect } = require('chai');
const { setupdriver } = require('../utils/driver');
const LoginPage = require('../pages/login-page');
const { validUsername, validPassword } = require('../helpers/auth');
const { until } = require('selenium-webdriver');

describe('Login Page Tests', function () {
  this.timeout(30000); // Timeout esteso per i test

  let driver;
  let loginPage;

  const LOGIN_URL = 'https://idm.digital-enabler.eng.it/auth/realms/avant/protocol/openid-connect/auth?response_type=code&client_id=rule-app&redirect_uri=https://rm-middleware-api.core.digital-enabler.eng.it/api/v1/avant/auth/callback';

  before(async function () {
    console.log('Inizializzazione driver...');
    driver = await setupdriver();
    loginPage = new LoginPage(driver);
  });

  after(async function () {
    console.log('Chiusura browser...');
    if (driver) await driver.quit();
  });

  beforeEach(async function () {
    console.log('Navigazione alla pagina di login...');
    await loginPage.open(LOGIN_URL); //apriamo il keycloak tramite url
  });

  //carichiamo la pagina e constatiamo che i campi sono vuoti
  it('should load login page correctly', async function () {
    expect(await loginPage.isLoaded()).to.be.true;
    expect(await loginPage.areFieldsEmpty()).to.be.true;
    console.log('✅ Pagina di login caricata correttamente');
  });

  //inseriamo nei campi di testo le credenziali come in auth.js, le riutilizziamo visto che sono centralizzate lì
  it('should login with valid credentials', async function () {
    await loginPage.login(validUsername, validPassword); // Riutilizza le credenziali di auth.js visto che sono centralizzate lì

    const hasError = await loginPage.hasErrorMessage();
    expect(hasError).to.be.false;

    //verifichiamo che l'url contenga /login
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.not.include('/login');
    console.log('✅ Login con credenziali valide riuscito');
  });

  //prova per credenziali false
  it('should show error with invalid credentials', async function () {
    await loginPage.login('invalid@example.com', 'wrongpassword');
    await driver.wait(until.elementLocated(loginPage.errorMessage), 5000);

    const hasError = await loginPage.hasErrorMessage();
    expect(hasError).to.be.true;

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).to.not.be.null;
    expect(errorMessage.toLowerCase()).to.include('invalid');
    console.log(`✅ Errore mostrato correttamente: ${errorMessage}`);
  });

  //prova per cmapi lasciati vuoti
  it('should handle empty fields', async function () {
    await loginPage.clickSignIn();
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include('/login');
    console.log('✅ Gestione campi vuoti funziona correttamente');
  });

  //prova con credenziali di test per verificare che l'input nei campi funzioni correttamente
  it('should allow typing in username and password fields', async function () {
    const testUsername = 'test.user@example.com';
    const testPassword = 'testpassword123';

    await loginPage.enterUsername(testUsername);
    const usernameElement = await loginPage.findElement(loginPage.usernameInput);
    expect(await usernameElement.getAttribute('value')).to.equal(testUsername);

    await loginPage.enterPassword(testPassword);
    const passwordElement = await loginPage.findElement(loginPage.passwordInput);
    expect(await passwordElement.getAttribute('value')).to.equal(testPassword);

    console.log('✅ Input nei campi funziona correttamente');
  });
});
