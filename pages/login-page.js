const { By } = require('selenium-webdriver');
const BasePage = require('./base-page');

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    
    // Locatori per gli elementi della pagina
    this.usernameInput = By.name('username'); 
    this.passwordInput = By.name('password'); 
    this.signInButton = By.id("kc-login");
    this.errorMessage = By.css('.pf-c-form__helper-text.pf-m-error.required.kc-feedback-text');
    this.loadingSpinner = By.id('loading');
  }

  // Naviga alla pagina di login
  async open(url) {
    await this.driver.get(url);
    return this;
  }

  // Inserisci username
  async enterUsername(username) {
    await this.type(this.usernameInput, username);
    console.log(`Username inserito: ${username}`);
  }

  // Inserisci password
  async enterPassword(password) {
    await this.type(this.passwordInput, password);
    console.log('Password inserita');
  }

  // Clicca sul bottone Sign In
  async clickSignIn() {
    await this.click(this.signInButton);
    console.log('Bottone Sign In cliccato');
  }

  // Esegui login completo
  async login(username, password) {
    console.log('Iniziando processo di login...');
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickSignIn();
    
    // Aspetta che il loading scompaia (se presente)
    try {
      await this.driver.wait(async () => {
        const isLoading = await this.isElementVisible(this.loadingSpinner, 1000);
        return !isLoading;
      }, 10000);
    } catch (e) {
      // Loading spinner non presente, continua
    }
    
    console.log('Login completato');
  }

  // Verifica se c'è un messaggio di errore
  async hasErrorMessage() {
    return await this.isElementVisible(this.errorMessage, 3000);
  }

  // Ottieni il messaggio di errore
  async getErrorMessage() {
    if (await this.hasErrorMessage()) {
      return await this.getText(this.errorMessage);
    }
    return null;
  }


  // Verifica se la pagina di login è caricata
  async isLoaded() {
    const usernameVisible = await this.isElementVisible(this.usernameInput);
    const passwordVisible = await this.isElementVisible(this.passwordInput);
    const buttonVisible = await this.isElementVisible(this.signInButton);
    
    return usernameVisible && passwordVisible && buttonVisible;
  }

  // Ottieni il testo del bottone
  async getSignInButtonText() {
    return await this.getText(this.signInButton);
  }

  // Verifica se i campi sono vuoti
  async areFieldsEmpty() {
    const usernameElement = await this.findElement(this.usernameInput);
    const passwordElement = await this.findElement(this.passwordInput);
    
    const usernameValue = await usernameElement.getAttribute('value');
    const passwordValue = await passwordElement.getAttribute('value');
    
    return usernameValue === '' && passwordValue === '';
  }
}

module.exports = LoginPage;