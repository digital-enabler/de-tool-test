const { By } = require("selenium-webdriver");
const BasePage = require("./base-page");

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);

    // Locators for page elements
    this.usernameInput = By.name("username");
    this.passwordInput = By.name("password");
    this.signInButton = By.id("kc-login");
    this.errorMessage = By.css(
      ".pf-c-form__helper-text.pf-m-error.required.kc-feedback-text"
    );
    this.loadingSpinner = By.id("loading");
  }

  // Navigate to login page
  async open(url) {
    await this.driver.get(url);
    return this;
  }

  // Enter username
  async enterUsername(username) {
    console.log("Valore di username prima di sendKeys:", username);
    await this.type(this.usernameInput, username);
    console.log(`Username inserito: ${username}`);
  }

  // Enter password
  async enterPassword(password) {
    await this.type(this.passwordInput, password);
    console.log("Password inserita");
  }

  // Click on Sign In button
  async clickSignIn() {
    await this.click(this.signInButton);
    console.log("Bottone Sign In cliccato");
  }

  // Complete login
  async login(username, password) {
    console.log("Iniziando processo di login...");
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickSignIn();

    // Wait for loading to disappear (if present)
    try {
      await this.driver.wait(async () => {
        const isLoading = await this.isElementVisible(
          this.loadingSpinner,
          1000
        );
        return !isLoading;
      }, 10000);
    } catch (e) {
      // Loading spinner not present, continue
    }

    console.log("Login completato");
  }

  // Check for an error message
  async hasErrorMessage() {
    return await this.isElementVisible(this.errorMessage, 3000);
  }

  // Get error message
  async getErrorMessage() {
    if (await this.hasErrorMessage()) {
      return await this.getText(this.errorMessage);
    }
    return null;
  }

  // Check whether the login page is loaded
  async isLoaded() {
    const usernameVisible = await this.isElementVisible(this.usernameInput);
    const passwordVisible = await this.isElementVisible(this.passwordInput);
    const buttonVisible = await this.isElementVisible(this.signInButton);

    return usernameVisible && passwordVisible && buttonVisible;
  }
}

module.exports = LoginPage;
