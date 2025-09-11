const { describe, it, before, after } = require("mocha");
const { expect } = require("chai");
const { By, until, Key } = require("selenium-webdriver"); // <-- Aggiunto Key qui!
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

    it("should edit the action of first available rule by clicking the pencil icon", async function () {
        const firstRuleLocator = By.css(".v-data-table__tr .v-data-table__td .v-list-item");
        await driver.wait(until.elementLocated(firstRuleLocator), 15000);
        const firstRuleElement = await driver.findElement(firstRuleLocator);
        await firstRuleElement.click();

        await driver.wait(until.urlContains("/editor/summary"), 15000);
        const currentUrl = await driver.getCurrentUrl();
        expect(currentUrl).to.include("/editor/summary");
        await driver.sleep(3000);

        const actionButtonLocator = By.xpath(`//button[contains(@class, 'v-stepper-item')]//div[text()='Actions']`);
        await driver.wait(until.elementLocated(actionButtonLocator), 10000);
        const actionsButton = await driver.findElement(actionButtonLocator);
        await actionsButton.click();
        await driver.sleep(3000);

        const pencilIconLocator = By.css(".v-list-item .mdi-pencil");
        try {
            const pencilIconElement = await driver.wait(until.elementLocated(pencilIconLocator), 10000);
            await driver.wait(until.elementIsVisible(pencilIconElement), 5000);
            await driver.wait(until.elementIsEnabled(pencilIconElement), 5000);
            await pencilIconElement.click();
            console.log("Icona di modifica cliccata con successo.");
        } catch (error) {
            console.error(`Errore nel cliccare l'icona di modifica: ${error.message}`);
            throw error;
        }
        await driver.sleep(3000);

        const chatIdInputLocator = By.xpath("//label[text()='Chat ID']/following-sibling::input");

        await driver.wait(until.elementLocated(chatIdInputLocator), 10000);
        const chatIdInputElement = await driver.findElement(chatIdInputLocator);

        await chatIdInputElement.sendKeys(Key.chord(Key.CONTROL, "a"));
        await chatIdInputElement.sendKeys(Key.BACK_SPACE);

        const newChatId = "987654";
        await chatIdInputElement.sendKeys(newChatId);
        await driver.sleep(3000);

        await creationPage.clickButtonByText("SAVE");
        await driver.sleep(3000);

        await creationPage.handleConfirmationModal();
        await driver.sleep(3000);

        await creationPage.clickButtonByText("CONTINUE");
        await driver.sleep(3000);

        await creationPage.clickButtonByText("UPDATE");
        await driver.sleep(6000);
    });
});
