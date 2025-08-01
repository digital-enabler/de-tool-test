const { By } = require("selenium-webdriver");
const BasePage = require("./base-page");

class LoginPage extends BasePage {
    constructor(driver) {
        super(driver);

        this.usernameInput = By.name("username"); // username text field selector
        this.passwordInput = By.name("password"); // password text field selector
        this.signInButton = By.id("kc-login"); // sign in button selector
        this.errorMessage = By.css(".pf-c-form__helper-text.pf-m-error.required.kc-feedback-text"); // error message selector
        this.loadingSpinner = By.id("loading"); // loading icon selector
    }

    async open(url) {
        await this.driver.get(url);
        return this;
    }

    async enterUsername(username) {
        await this.type(this.usernameInput, username);
    }

    async enterPassword(password) {
        await this.type(this.passwordInput, password);
    }

    async clickSignIn() {
        await this.click(this.signInButton);
    }

    async login(username, password) {
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickSignIn();

        try {
            await this.driver.wait(async () => {
                const isLoading = await this.isElementVisible(this.loadingSpinner, 1000);
                return !isLoading;
            }, 10000);
        } catch (e) {}
    }

    async hasErrorMessage() {
        return await this.isElementVisible(this.errorMessage, 3000);
    }

    async getErrorMessage() {
        if (await this.hasErrorMessage()) {
            return await this.getText(this.errorMessage);
        }
        return null;
    }

    async isLoaded() {
        const usernameVisible = await this.isElementVisible(this.usernameInput);
        const passwordVisible = await this.isElementVisible(this.passwordInput);
        const buttonVisible = await this.isElementVisible(this.signInButton);

        return usernameVisible && passwordVisible && buttonVisible;
    }

    async areFieldsEmpty() {
        const usernameElement = await this.findElement(this.usernameInput);
        const passwordElement = await this.findElement(this.passwordInput);

        const usernameValue = await usernameElement.getAttribute("value");
        const passwordValue = await passwordElement.getAttribute("value");

        return usernameValue === "" && passwordValue === "";
    }
}

module.exports = LoginPage;
