const { describe, it, before, after } = require("mocha");
const { expect } = require("chai");
const { By, until } = require("selenium-webdriver");
const initHomePageSession = require("../helpers/initHomePageSession");
const RuleCreationPage = require("../pages/rule-creation-pages");

describe("Edit Asset of Rule Test", function () {
    this.timeout(120000);

    let driver;
    let homePage;
    let creationPage;

    before(async function () {
        const session = await initHomePageSession();
        driver = session.driver;
        homePage = session.homePage;
        creationPage = new RuleCreationPage(driver);
    });

    after(async function () {
        if (driver) await driver.quit();
    });

    it("should edit the asset of first available rule", async function () {
        const firstRuleLocator = By.css(".v-data-table__tr .v-data-table__td .v-list-item");

        await driver.wait(until.elementLocated(firstRuleLocator), 15000);
        const firstRuleElement = await driver.findElement(firstRuleLocator);
        await firstRuleElement.click();

        await driver.wait(until.urlContains("/editor/summary"), 15000);
        let currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.include("/editor/summary");

        await driver.sleep(3000);

        const assetsButtonLocator = By.xpath(`//button[contains(@class, 'v-stepper-item')]//div[text()='Assets']`);
        await driver.wait(until.elementLocated(assetsButtonLocator), 10000);
        const assetsButton = await driver.findElement(assetsButtonLocator);
        await assetsButton.click();
        await driver.sleep(3000);

        const specificDeleteIconLocator = By.css(".v-list-item-action .v-btn");

        try {
            const specificDeleteIconElement = await driver.wait(until.elementLocated(specificDeleteIconLocator), 10000);
            await driver.wait(until.elementIsVisible(specificDeleteIconElement), 5000);
            await driver.wait(until.elementIsEnabled(specificDeleteIconElement), 5000);
            await specificDeleteIconElement.click();
        } catch (error) {
            console.error(`Error in clicking specific 'Delete Settings' icon: ${error.message}`);
            throw error;
        }

        await creationPage.clickCardByText("NGSI ENTITY");
        await driver.sleep(3000);

        await creationPage.clickRightArrowButton();
        await driver.sleep(3000);

        await creationPage.clickButtonByText("CONTINUE");
        await driver.sleep(3000);

        await creationPage.clickButtonByText("CONTINUE");
        await driver.sleep(3000);

        await creationPage.clickButtonByText("CONTINUE");
        await driver.sleep(3000);

        await creationPage.clickButtonByText("UPDATE");
        await driver.sleep(6000);
    });
});
