const { describe, it, before, after, beforeEach } = require("mocha");
const { expect } = require("chai");
const { setupdriver } = require("../utils/driver");
const LoginPage = require("../pages/login-page");
const { until } = require("selenium-webdriver");
const { validUsername, validPassword } = require("../helpers/auth");

describe("Login Page Tests", function () {
  this.timeout(30000); // General timeout for entire test

  let driver;
  let loginPage;

  const LOGIN_URL =
    "https://idm.digital-enabler.eng.it/auth/realms/avant/protocol/openid-connect/auth?response_type=code&client_id=rule-app&redirect_uri=https://rm-middleware-api.core.digital-enabler.eng.it/api/v1/avant/auth/callback";

  before(async function () {
    console.log("Inizializzazione driver...");
    driver = await setupdriver();
    loginPage = new LoginPage(driver);
  });

  after(async function () {
    console.log("Chiusura browser...");
    if (driver) await driver.quit();
  });

  beforeEach(async function () {
    console.log("Navigazione alla pagina di login...");
    await loginPage.open(LOGIN_URL);
  });

  // We load the page and see that the fields are empty
  it("should load login page correctly", async function () {
    expect(await loginPage.isLoaded()).to.be.true;
    expect(await loginPage.areFieldsEmpty()).to.be.true;
    console.log("✅ Pagina di login caricata correttamente");
  });

  // Test for false credentials
  it("should show error with invalid credentials", async function () {
    await loginPage.login("invalid@example.com", "wrongpassword");
    await driver.wait(until.elementLocated(loginPage.errorMessage), 5000);

    const hasError = await loginPage.hasErrorMessage();
    expect(hasError).to.be.true;

    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).to.not.be.null;
    expect(errorMessage.toLowerCase()).to.include("invalid");
    console.log(`✅ Errore mostrato correttamente: ${errorMessage}`);
  });

  // Test for fields left empty
  it("should handle empty fields", async function () {
    await loginPage.clickSignIn();
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include("/login");
    console.log("✅ Gestione campi vuoti funziona correttamente");
  });

  // Test with test credentials to verify that the input in the fields works correctly
  it("should allow typing in username and password fields", async function () {
    const testUsername = "test.user@example.com";
    const testPassword = "testpassword123";

    await loginPage.enterUsername(testUsername);
    const usernameElement = await loginPage.findElement(
      loginPage.usernameInput
    );
    expect(await usernameElement.getAttribute("value")).to.equal(testUsername);

    await loginPage.enterPassword(testPassword);
    const passwordElement = await loginPage.findElement(
      loginPage.passwordInput
    );
    expect(await passwordElement.getAttribute("value")).to.equal(testPassword);

    console.log("✅ Input nei campi funziona correttamente");
  });
});
