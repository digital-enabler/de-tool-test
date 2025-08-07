const { By, until } = require("selenium-webdriver");
const BasePage = require("./base-page");
const { Key } = require("selenium-webdriver");

class HomePage extends BasePage {
    constructor(driver) {
        super(driver);
        this.title = By.css(".text-primary.text-h5.font-weight-bold"); // title (rules)
        this.searchInput = By.id("input-v-1"); //input searchbar
        this.searchResultItem = By.xpath(
            "//td[contains(@class, 'v-data-table__td')]//span[contains(@class, 'd-inline-block') and contains(@class, 'text-truncate')]"
        ); // take result from table
        this.selectionCheckbox = By.id("input-v-4"); // general selection
        this.deleteIcon = By.css(
            ".mdi-delete.mdi.v-icon.notranslate.v-theme--light.v-icon--size-default.text-secondary.v-icon--clickable.d-inline-block.ml-2"
        ); // general delete icon
        this.firstRowCheckbox = By.css("tbody tr:first-child td.v-data-table__td--select-row .v-selection-control"); // selection single row
        this.firstRowThreeDotMenu = By.css(
            "tbody tr:first-child .mdi-dots-vertical.mdi.v-icon.notranslate.v-theme--light.v-icon--size-default"
        ); // three-dot menu in first row
        this.menuOptions = By.css(".v-list-item-title"); // menu options
        this.renameInput = By.name("ruleName"); // rename input according to name
        this.renameButton = By.css(
            ".v-btn.v-btn--slim.v-theme--light.text-secondary.darken-1.v-btn--density-default.v-btn--size-default.v-btn--variant-text"
        ); //rename button
        this.sidebarMenuButton = By.css(
            ".mdi-menu.mdi.v-icon.notranslate.v-theme--light.v-icon--size-x-large.text-secondary"
        ); //sidebar button burger icon
        this.sidebarRulesItem = By.css(".v-list-item-title.text-white.text-uppercase"); // click on rules in sidebar
    }

    async getTitleText() {
        const element = await this.driver.findElement(this.title);
        return await element.getText();
    }

    async searchFor(term) {
        try {
            const searchInput = await this.driver.wait(until.elementLocated(this.searchInput), 5000);
            await searchInput.click();

            await this.driver.sleep(1000);

            await searchInput.sendKeys(term);

            await this.driver.sleep(1000);

            await this.driver.wait(until.elementLocated(this.searchResultItem), 5000);

            await this.driver.sleep(2000);
        } catch (e) {
            throw e;
        }
    }

    async getSearchResultsText() {
        const results = await this.driver.findElements(this.searchResultItem);
        const texts = [];
        for (const el of results) {
            if (await el.isDisplayed()) {
                texts.push(await el.getText());
            }
        }
        return texts;
    }

    async clickSelectionCheckbox() {
        const checkbox = await this.driver.wait(until.elementLocated(this.selectionCheckbox), 5000);
        await checkbox.click();
    }

    async isDeleteIconVisible() {
        try {
            const icon = await this.driver.wait(until.elementLocated(this.deleteIcon), 5000);
            return await icon.isDisplayed();
        } catch (e) {
            return false;
        }
    }

    async clickFirstRowCheckbox() {
        const checkbox = await this.driver.findElement(this.firstRowCheckbox);
        await checkbox.click();
        await this.driver.sleep(1500);
    }

    async clickFirstRowThreeDotMenu() {
        const menuButton = await this.driver.findElement(this.firstRowThreeDotMenu);
        await menuButton.click();
    }

    async clickMenuOptionByText(text) {
        await this.driver.wait(async () => {
            const options = await this.driver.findElements(this.menuOptions);
            return options.length > 0;
        }, 5000);

        const options = await this.driver.findElements(this.menuOptions);

        for (const option of options) {
            const optionText = await option.getText();
            if (optionText.toLowerCase() === text.toLowerCase()) {
                await option.click();
                return;
            }
        }
        throw new Error(`Menu option with text "${text}" not found`);
    }

    async fillRenameInput(newName) {
        const input = await this.driver.findElement(this.renameInput);
        await input.sendKeys(Key.chord(Key.CONTROL, "a"), Key.BACK_SPACE);
        await input.sendKeys(newName);
    }

    async clickRenameButton() {
        const button = await this.driver.findElement(this.renameButton);
        await this.driver.sleep(1500);
        await button.click();
    }
    e;
    async clickButtonByText(text) {
        await this.driver.wait(async () => {
            const buttons = await this.driver.findElements(By.css("button"));
            return buttons.length > 0;
        }, 5000);

        const buttons = await this.driver.findElements(By.css("button"));
        for (const button of buttons) {
            const btnText = await button.getText();
            if (btnText.trim().toLowerCase() === text.toLowerCase()) {
                await button.click();
                return;
            }
        }

        throw new Error(`Button with text "${text}" not found`);
    }

    async getFirstRowName() {
        const firstRowNameElement = await this.driver.wait(
            until.elementLocated(By.css("tbody tr:first-child td:nth-child(2)")),
            5000
        );
        return await firstRowNameElement.getText();
    }

    async searchForAllowingNoResults(term) {
        try {
            const searchInput = await this.driver.wait(until.elementLocated(this.searchInput), 5000);
            await searchInput.click();
            await searchInput.sendKeys(term);

            await this.driver.sleep(1500);
        } catch (e) {
            console.error("Errore in searchForAllowingNoResults:", e);
            throw e;
        }
    }
}

module.exports = HomePage;
