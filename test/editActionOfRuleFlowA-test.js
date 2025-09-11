const { describe, it, before, after } = require("mocha");
const { expect } = require("chai");
const { By, until } = require("selenium-webdriver");
const initHomePageSession = require("../helpers/initHomePageSession");
const RuleCreationPage = require("../pages/rule-creation-pages");

describe("Edit Action of Rule Test", function () {
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

    it("should edit the action of first available rule", async function () {
        const firstRuleLocator = By.css(".v-data-table__tr .v-data-table__td .v-list-item");

        await driver.wait(until.elementLocated(firstRuleLocator), 15000);
        const firstRuleElement = await driver.findElement(firstRuleLocator);
        await firstRuleElement.click();

        await driver.wait(until.urlContains("/editor/summary"), 15000);
        let currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.include("/editor/summary");
        await driver.sleep(3000);

        const actionButtonLocator = By.xpath(`//button[contains(@class, 'v-stepper-item')]//div[text()='Actions']`);
        await driver.wait(until.elementLocated(actionButtonLocator), 10000);
        const actionsButton = await driver.findElement(actionButtonLocator);
        await actionsButton.click();
        await driver.sleep(3000);

        const specificDeleteIconLocator = By.css(".v-list-item .v-btn__content .mdi-delete");

        try {
            const specificDeleteIconElement = await driver.wait(until.elementLocated(specificDeleteIconLocator), 10000);
            await driver.wait(until.elementIsVisible(specificDeleteIconElement), 5000);
            await driver.wait(until.elementIsEnabled(specificDeleteIconElement), 5000);
            await specificDeleteIconElement.click();
        } catch (error) {
            console.error(`Error in clicking specific 'Delete Settings': ${error.message}`);
            throw error;
        }

        await driver.sleep(3000);

        await creationPage.telegramAction({
            chatId: 123456,
            message: "Test messaggio Telegram da Selenium",
        });

        await creationPage.handleConfirmationModal();
        await driver.sleep(3000);

        await creationPage.clickButtonByText("CONTINUE");
        await driver.sleep(3000);

        await creationPage.clickButtonByText("UPDATE");
        await driver.sleep(6000);
    });
});
