const { By, until } = require("selenium-webdriver");

async function changeLanguage(driver, languageText) {
    const profileMenuSelector = By.css(".v-avatar");
    await driver.wait(until.elementLocated(profileMenuSelector), 10000);
    const profileMenu = await driver.findElement(profileMenuSelector);
    await driver.wait(until.elementIsVisible(profileMenu), 5000);
    await profileMenu.click();

    const languageButtonSelector = By.xpath("//div[contains(text(),'Language')]");
    await driver.wait(until.elementLocated(languageButtonSelector), 10000);
    await driver.sleep(1000);
    const languageButton = await driver.findElement(languageButtonSelector);
    await languageButton.click();

    const languageOption = By.xpath(`//div[contains(text(),'${languageText}')]`);
    await driver.wait(until.elementLocated(languageOption), 10000);
    await driver.sleep(1000);
    const languageSelection = await driver.findElement(languageOption);
    await languageSelection.click();
}

module.exports = changeLanguage;
