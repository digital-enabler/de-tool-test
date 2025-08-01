const { By, until } = require("selenium-webdriver");

class BasePage {
    constructor(driver) {
        this.driver = driver;
        this.timeout = 10000;
    }

    async findElement(locator, timeout = this.timeout) {
        return await this.driver.wait(until.elementLocated(locator), timeout);
    }

    async findClickableElement(locator, timeout = this.timeout) {
        const element = await this.findElement(locator, timeout);
        return await this.driver.wait(until.elementIsEnabled(element), timeout);
    }

    async click(locator) {
        const element = await this.findClickableElement(locator);
        await element.click();
        return element;
    }

    async type(locator, text) {
        const element = await this.findElement(locator);
        await element.clear();
        await element.sendKeys(text);
        return element;
    }

    async getText(locator) {
        const element = await this.findElement(locator);
        return await element.getText();
    }

    async isElementVisible(locator, timeout = this.timeout) {
        try {
            const element = await this.findElement(locator, timeout);
            await this.driver.wait(until.elementIsVisible(element), timeout);
            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = BasePage;
