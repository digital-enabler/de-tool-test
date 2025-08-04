const { loginWithValidCredentials } = require("./auth");
const { By, until } = require("selenium-webdriver");
const HomePage = require("../pages/home-page");
const { LOGIN_URL } = require("../utils/constants");

async function initHomePageSession() {
    const session = await loginWithValidCredentials();
    const driver = session.driver;

    await driver.get(LOGIN_URL);

    await driver.executeScript(`localStorage.setItem('lang', 'en');`);
    await driver.navigate().refresh();

    const homePage = new HomePage(driver);
    const readyIndicator = By.css(".mdi-dots-vertical");
    await driver.wait(until.elementLocated(readyIndicator), 10000);
    const menuDots = await driver.findElement(readyIndicator);
    await driver.wait(until.elementIsVisible(menuDots), 5000);

    return { driver, homePage };
}

module.exports = initHomePageSession;
