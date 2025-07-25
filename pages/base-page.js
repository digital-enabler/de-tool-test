const { By, until } = require("selenium-webdriver");

class BasePage {
  constructor(driver) {
    this.driver = driver;
    this.timeout = 10000; // default timeout
  }

  // Find an element and wait for it to be present
  async findElement(locator, timeout = this.timeout) {
    return await this.driver.wait(until.elementLocated(locator), timeout);
  }

  // Find an item and wait for it to be clickable
  async findClickableElement(locator, timeout = this.timeout) {
    const element = await this.findElement(locator, timeout);
    return await this.driver.wait(until.elementIsEnabled(element), timeout);
  }

  // Click on item
  async click(locator) {
    const element = await this.findClickableElement(locator);
    await element.click();
    return element;
  }

  // Insert text into a field
  async type(locator, text) {
    const element = await this.findElement(locator);
    await element.clear();
    await element.sendKeys(text);
    return element;
  }

  // Get text from an element
  async getText(locator) {
    const element = await this.findElement(locator);
    return await element.getText();
  }

  // Checking whether an element is visible
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
