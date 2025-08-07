const { By, until, Key } = require("selenium-webdriver");

class RuleCreationPage {
    constructor(driver) {
        this.driver = driver;
        this.ruleNameClickableContainer = By.css(".v-overlay__content .v-input__control"); // Selector for the clickable container (the one the user sees and clicks)
        this.ruleNameInputActual = By.css('.v-overlay__content input[name="ruleName"]'); // Selector for the actual input (the one with opacity: 0, where we will send the text)
        this.save_button = By.css(".v-card-actions .v-btn.text-secondary"); // Save button selector in the modal
        this.menuOptions = By.css(".v-overlay .v-list-item-title"); // menu options
        this.emailToField = By.css('input[name="emailTo"]'); // text field To
        this.emailSubjectField = By.css('input[name="emailSubject"]'); // text field Subject
        this.saveButtonOnAction = By.xpath("//button[.//span[text()='Save']]"); // save button within the div with the fields to be filled in
        this.actionScrollableContainer = By.css(".v-card.overflow-y-auto"); // selector div scrollbar
        this.telegramChatIdField = By.xpath("//label[text()='Chat ID']/following-sibling::input"); // chat id telegram text field selector
        this.telegramMessageField = By.xpath("//label[text()='Message']/following-sibling::textarea"); // message telegram text field selector
        this.webhookUrlField = By.xpath("//label[text()='URL']/following-sibling::input"); // url webhook text field selector
        this.kafkaHostField = By.xpath("//label[text()='Host']/following-sibling::input"); // host kafka text field selector
        this.kafkaPortField = By.xpath("//label[text()='Port']/following-sibling::input"); // port kafka text field selector
        this.kafkaTopicNameField = By.xpath("//label[text()='Topic name']/following-sibling::input"); // topic name kafka text field selector
        this.kafkaValueField = By.xpath("//label[text()='Value']/following-sibling::textarea"); // value kafka text field selector
        this.searchResultItem = By.css(".v-data-table__tr"); // rule title on table
    }

    async fillRuleName(newName) {
        let inputElement;
        let containerElement;

        containerElement = await this.driver.wait(until.elementLocated(this.ruleNameClickableContainer), 15000);
        await this.driver.wait(until.elementIsVisible(containerElement), 10000);
        await this.driver.wait(until.elementIsEnabled(containerElement), 10000);
        await containerElement.click();
        await this.driver.sleep(500);

        inputElement = await this.driver.wait(until.elementLocated(this.ruleNameInputActual), 10000);
        await this.driver.wait(until.elementIsEnabled(inputElement), 10000);

        try {
            await inputElement.sendKeys(Key.chord(Key.CONTROL, "a"));
            await inputElement.sendKeys(Key.BACK_SPACE);
        } catch (e) {
            console.warn(e.message);
        }

        await inputElement.sendKeys(newName);
    }

    async clickSave() {
        const btn = await this.driver.wait(until.elementLocated(this.save_button), 5000);
        await btn.click();
    }

    async selectMenu(text) {
        const selectContainerLocator = By.css(".v-overlay .v-input.v-select .v-field");
        let selectContainerElement;

        try {
            selectContainerElement = await this.driver.wait(until.elementLocated(selectContainerLocator), 10000);
            await this.driver.wait(until.elementIsVisible(selectContainerElement), 5000);
            await this.driver.wait(until.elementIsEnabled(selectContainerElement), 5000);

            await this.driver.executeScript(
                "arguments[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));",
                selectContainerElement
            );
            await this.driver.sleep(1000);

            const menuOptionsContainerLocator = By.css(".v-overlay .v-list");
            const menuOptionsContainer = await this.driver.wait(
                until.elementLocated(menuOptionsContainerLocator),
                20000
            );
            await this.driver.wait(until.elementIsVisible(menuOptionsContainer), 10000);
        } catch (error) {
            console.error(`Error during option selection "${text}":`, error.message);
            throw error;
        }
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

    async clickCardByText(cardText) {
        const allCardsLocator = By.css(
            ".v-card.v-card--link.v-theme--light.bg-primary.lighten-4.v-card--density-default.v-card--variant-elevated.ma-2"
        );

        const cardWithTextLocator = By.xpath(
            `//div[contains(@class, 'v-card--link') and contains(@class, 'v-card') and .//*[normalize-space(text())='${cardText}']]`
        );

        let cardToClick;
        try {
            cardToClick = await this.driver.wait(until.elementLocated(cardWithTextLocator), 15000);
            await this.driver.wait(until.elementIsVisible(cardToClick), 5000);
            await this.driver.wait(until.elementIsEnabled(cardToClick), 5000);

            await cardToClick.click();
        } catch (error) {
            console.error(`Error in clicking card with text "${cardText}":`, error.message);
            throw error;
        }
    }

    async clickRightArrowButton() {
        const arrowButtonLocator = By.css("i.mdi-arrow-right-bold-circle");

        let arrowButton;
        try {
            arrowButton = await this.driver.wait(until.elementLocated(arrowButtonLocator), 10000);

            await this.driver.wait(until.elementIsVisible(arrowButton), 5000);

            await this.driver.wait(until.elementIsEnabled(arrowButton), 5000);

            await arrowButton.click();
        } catch (error) {
            console.error(`Error in clicking the right arrow button:`, error.message);
            throw error;
        }
    }

    async clickButtonByText(text) {
        await this.driver.wait(async () => {
            const buttons = await this.driver.findElements(By.css("button"));
            return buttons.length > 0;
        }, 10000);

        const buttons = await this.driver.findElements(By.css("button"));

        for (const button of buttons) {
            try {
                const btnText = await button.getText();
                const isVisible = await button.isDisplayed();
                const isEnabled = await button.isEnabled();

                if (isVisible && isEnabled && btnText.trim().toLowerCase() === text.toLowerCase()) {
                    await button.click();
                    return;
                }
            } catch (e) {}
        }

        throw new Error(`Button with text "${text}" not found or not clickable.`);
    }

    async selectMenuInRowByTdIndex(tdIndex) {
        const selectContainerLocator = By.xpath(
            `//tr[@class='mt-2' and @height='80px']/td[${tdIndex}]` +
                `//div[contains(@class, 'v-input') and contains(@class, 'v-select')]//div[contains(@class, 'v-field')]`
        );

        let selectContainerElement;

        try {
            selectContainerElement = await this.driver.wait(until.elementLocated(selectContainerLocator), 15000);
            await this.driver.wait(until.elementIsVisible(selectContainerElement), 5000);
            await this.driver.wait(until.elementIsEnabled(selectContainerElement), 5000);

            await this.driver.executeScript(
                "arguments[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));",
                selectContainerElement
            );
            await this.driver.sleep(1000);

            const menuOptionsContainerLocator = By.css(".v-overlay .v-list");
            const menuOptionsContainer = await this.driver.wait(
                until.elementLocated(menuOptionsContainerLocator),
                20000
            );
            await this.driver.wait(until.elementIsVisible(menuOptionsContainer), 10000);
        } catch (error) {
            console.error(`Error during opening select menu in ${tdIndex}° <td>:`, error.message);
            throw error;
        }
    }

    async fillTextFieldInRowByTdIndex(tdIndex, value) {
        const textFieldLocator = By.xpath(
            `//tr[@class='mt-2' and @height='80px']/td[${tdIndex}]` +
                `//div[contains(@class, 'v-text-field')]//input[contains(@class, 'v-field__input')]`
        );

        let textFieldElement;

        try {
            textFieldElement = await this.driver.wait(until.elementLocated(textFieldLocator), 15000);
            await this.driver.wait(until.elementIsVisible(textFieldElement), 5000);
            await this.driver.wait(until.elementIsEnabled(textFieldElement), 5000);

            await textFieldElement.click();

            await textFieldElement.sendKeys(Key.chord(Key.CONTROL, "a"));

            await textFieldElement.sendKeys(Key.BACK_SPACE);

            await textFieldElement.sendKeys(value);
        } catch (error) {
            console.error(`Error during entering value in text field of ${tdIndex}° <td>:`, error.message);
            throw error;
        }
    }

    async mailAction(mailDetails = {}) {
        const cardText = "E-MAIL";
        const actionCardWithTextLocator = By.xpath(
            `//div[contains(@class, 'v-card--link') and contains(@class, 'v-card') ` +
                `and contains(@class, 'bg-secondary') and contains(@class, 'lighten-4') ` +
                `and .//*[normalize-space(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'))='${cardText.toLowerCase()}']]`
        );
        let cardToClick;
        try {
            await this.driver.sleep(1000);
            cardToClick = await this.driver.wait(until.elementLocated(actionCardWithTextLocator), 20000);
            await this.driver.wait(until.elementIsVisible(cardToClick), 10000);
            await this.driver.wait(until.elementIsEnabled(cardToClick), 10000);
            await cardToClick.click();
            await this.driver.sleep(1000);
        } catch (error) {
            console.error(`Error in clicking action card with text "${cardText}":`, error.message);
            throw error;
        }

        if (!mailDetails.to) {
            throw new Error(
                "The recipient (‘to’ field) is a mandatory field for the E-Mail action and was not provided."
            );
        }
        const toElement = await this.driver.wait(until.elementLocated(this.emailToField), 10000);
        await toElement.clear();
        await toElement.sendKeys(mailDetails.to);

        if (!mailDetails.subject) {
            throw new Error("The subject is a mandatory field for the E-Mail action and was not provided.");
        }
        const subjectElement = await this.driver.wait(until.elementLocated(this.emailSubjectField), 10000);
        await subjectElement.clear();
        await subjectElement.sendKeys(mailDetails.subject);

        try {
            const scrollableElement = await this.driver.wait(
                until.elementLocated(this.actionScrollableContainer),
                5000
            );
            await this.driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight", scrollableElement);
            await this.driver.sleep(500);
        } catch (scrollError) {
            console.warn(
                "Attention: Cannot find or scroll the specific container for the E-Mail action.",
                scrollError.message
            );
            await this.driver.executeScript("window.scrollBy(0, 500)");
        }
        await this.driver.sleep(2000);

        const shouldSave = mailDetails.save === undefined ? true : mailDetails.save;
        if (shouldSave) {
            const saveButton = await this.driver.wait(until.elementLocated(this.saveButtonOnAction), 15000);
            await this.driver.wait(until.elementIsVisible(saveButton), 5000);

            await this.driver.wait(
                async () => {
                    const disabledAttribute = await saveButton.getAttribute("disabled");
                    return disabledAttribute === null;
                },
                15000,
                "The SAVE button was disabled for too long."
            );
            await saveButton.click();
        } else {
        }
    }

    async handleConfirmationModal() {
        const modalLocator = By.css(".v-overlay__content");
        await this.driver.wait(until.elementLocated(modalLocator), 10000);

        const saveButtonInModalLocator = By.css(".v-overlay__content .v-btn.v-btn--slim");
        const buttons = await this.driver.wait(until.elementsLocated(saveButtonInModalLocator), 10000);

        let saveButton;

        for (const button of buttons) {
            const buttonText = await button.getText();
            if (buttonText.trim() === "SAVE") {
                saveButton = button;
                break;
            }
        }

        if (!saveButton) {
            throw new Error("Cannot find the “Save” button in the confirmation modal.");
        }

        await this.driver.wait(until.elementIsVisible(saveButton), 5000);
        await this.driver.wait(until.elementIsEnabled(saveButton), 5000);
        await saveButton.click();
        await this.driver.wait(until.stalenessOf(saveButton), 5000);
    }

    async telegramAction(telegramDetails = {}) {
        const cardText = "TELEGRAM";
        const actionCardWithTextLocator = By.xpath(
            `//div[contains(@class, 'v-card--link') and contains(@class, 'v-card') ` +
                `and contains(@class, 'bg-secondary') and contains(@class, 'lighten-4') ` +
                `and .//*[normalize-space(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'))='${cardText.toLowerCase()}']]`
        );
        let cardToClick;
        try {
            await this.driver.sleep(1000);
            cardToClick = await this.driver.wait(until.elementLocated(actionCardWithTextLocator), 20000);
            await this.driver.wait(until.elementIsVisible(cardToClick), 10000);
            await this.driver.wait(until.elementIsEnabled(cardToClick), 10000);
            await cardToClick.click();
            await this.driver.sleep(1000);
        } catch (error) {
            console.error(`Error in clicking action card with text "${cardText}":`, error.message);
            throw error;
        }

        if (!telegramDetails.chatId) {
            throw new Error("The “Chat ID” is a mandatory field for the Telegram action and was not provided.");
        }
        const chatIdElement = await this.driver.wait(until.elementLocated(this.telegramChatIdField), 10000);
        await chatIdElement.clear();
        await chatIdElement.sendKeys(telegramDetails.chatId);

        if (!telegramDetails.message) {
            throw new Error("The 'Message' is a mandatory field for the Telegram action and was not provided.");
        }
        const messageElement = await this.driver.wait(until.elementLocated(this.telegramMessageField), 10000);
        await messageElement.clear();
        await messageElement.sendKeys(telegramDetails.message);

        try {
            const scrollableElement = await this.driver.wait(
                until.elementLocated(this.actionScrollableContainer),
                5000
            );
            await this.driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight", scrollableElement);
            await this.driver.sleep(500);
        } catch (scrollError) {
            console.warn(
                "Attention: Unable to find or scroll through the specific action container.",
                scrollError.message
            );
            await this.driver.executeScript("window.scrollBy(0, 500)");
        }
        await this.driver.sleep(2000);

        const saveButton = await this.driver.wait(until.elementLocated(this.saveButtonOnAction), 15000);
        await this.driver.wait(until.elementIsVisible(saveButton), 5000);
        await this.driver.wait(
            async () => {
                const disabledAttribute = await saveButton.getAttribute("disabled");
                return disabledAttribute === null;
            },
            15000,
            "The SAVE button was disabled for too long."
        );
        await saveButton.click();
    }

    async webhookAction(webhookDetails = {}) {
        const cardText = "WEBHOOK";
        const actionCardWithTextLocator = By.xpath(
            `//div[contains(@class, 'v-card--link') and contains(@class, 'v-card') ` +
                `and contains(@class, 'bg-secondary') and contains(@class, 'lighten-4') ` +
                `and .//*[normalize-space(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'))='${cardText.toLowerCase()}']]`
        );
        let cardToClick;
        try {
            await this.driver.sleep(1000);
            cardToClick = await this.driver.wait(until.elementLocated(actionCardWithTextLocator), 20000);
            await this.driver.wait(until.elementIsVisible(cardToClick), 10000);
            await this.driver.wait(until.elementIsEnabled(cardToClick), 10000);
            await cardToClick.click();
            await this.driver.sleep(1000);
        } catch (error) {
            console.error(`Error when clicking the Action Card with text "${cardText}":`, error.message);
            throw error;
        }

        if (!webhookDetails.url) {
            throw new Error("The URL is a mandatory field for the Webhook action and was not provided.");
        }
        const urlElement = await this.driver.wait(until.elementLocated(this.webhookUrlField), 10000);
        await urlElement.clear();
        await urlElement.sendKeys(webhookDetails.url);

        try {
            const scrollableElement = await this.driver.wait(
                until.elementLocated(this.actionScrollableContainer),
                5000
            );
            await this.driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight", scrollableElement);
            await this.driver.sleep(500);
        } catch (scrollError) {
            console.warn(
                "Attention: Cannot find or scroll the specific container for the Webhook action.",
                scrollError.message
            );
            await this.driver.executeScript("window.scrollBy(0, 500)");
        }
        await this.driver.sleep(2000);

        const shouldSave = webhookDetails.save === undefined ? true : webhookDetails.save;
        if (shouldSave) {
            const saveButton = await this.driver.wait(until.elementLocated(this.saveButtonOnAction), 15000);
            await this.driver.wait(until.elementIsVisible(saveButton), 5000);
            await this.driver.wait(
                async () => {
                    const disabledAttribute = await saveButton.getAttribute("disabled");
                    return disabledAttribute === null;
                },
                15000,
                "The SAVE button was disabled for too long."
            );
            await saveButton.click();
        } else {
        }
    }

    async kafkaAction(kafkaDetails = {}) {
        const cardText = "KAFKA";
        const actionCardWithTextLocator = By.xpath(
            `//div[contains(@class, 'v-card--link') and contains(@class, 'v-card') ` +
                `and contains(@class, 'bg-secondary') and contains(@class, 'lighten-4') ` +
                `and .//*[normalize-space(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'))='${cardText.toLowerCase()}']]`
        );
        let cardToClick;
        try {
            await this.driver.sleep(1000);
            cardToClick = await this.driver.wait(until.elementLocated(actionCardWithTextLocator), 20000);
            await this.driver.wait(until.elementIsVisible(cardToClick), 10000);
            await this.driver.wait(until.elementIsEnabled(cardToClick), 10000);

            await cardToClick.click();

            await this.driver.sleep(1000);
        } catch (error) {
            console.error(`Error when clicking the Action Card with text "${cardText}":`, error.message);
            throw error;
        }

        if (!kafkaDetails.host) {
            throw new Error("The “Host” field is mandatory for the Kafka action and was not provided.");
        }
        const hostElement = await this.driver.wait(until.elementLocated(this.kafkaHostField), 10000);
        await hostElement.clear();
        await hostElement.sendKeys(kafkaDetails.host);

        if (!kafkaDetails.port) {
            throw new Error("The “Port” field is mandatory for the Kafka action and was not provided.");
        }
        const portElement = await this.driver.wait(until.elementLocated(this.kafkaPortField), 10000);
        await portElement.clear();
        await portElement.sendKeys(String(kafkaDetails.port));

        if (!kafkaDetails.topicName) {
            throw new Error("The “Topic name” field is mandatory for the Kafka action and was not provided.");
        }
        const topicNameElement = await this.driver.wait(until.elementLocated(this.kafkaTopicNameField), 10000);
        await topicNameElement.clear();
        await topicNameElement.sendKeys(kafkaDetails.topicName);

        if (!kafkaDetails.value) {
            throw new Error("The “Value” field is mandatory for the Kafka action and was not provided.");
        }
        const valueElement = await this.driver.wait(until.elementLocated(this.kafkaValueField), 10000);
        await valueElement.clear();
        await valueElement.sendKeys(kafkaDetails.value);

        try {
            const scrollableElement = await this.driver.wait(
                until.elementLocated(this.actionScrollableContainer),
                5000
            );
            await this.driver.executeScript("arguments[0].scrollTop = arguments[0].scrollHeight", scrollableElement);
            await this.driver.sleep(500);
        } catch (scrollError) {
            console.warn(
                "Attention: Cannot find or scroll the specific container for the Kafka action.",
                scrollError.message
            );
            await this.driver.executeScript("window.scrollBy(0, 500)");
        }
        await this.driver.sleep(2000);

        const shouldSave = kafkaDetails.save === undefined ? true : kafkaDetails.save;
        if (shouldSave) {
            const saveButton = await this.driver.wait(until.elementLocated(this.saveButtonOnAction), 15000);
            await this.driver.wait(until.elementIsVisible(saveButton), 5000);
            await this.driver.wait(
                async () => {
                    const disabledAttribute = await saveButton.getAttribute("disabled");
                    return disabledAttribute === null;
                },
                15000,
                "The SAVE button was disabled for too long."
            );
            await saveButton.click();
        } else {
        }
    }

    async clickDeleteSettings() {
        console.log("By searching and clicking the “Delete Settings” icon...");
        const deleteIconElement = await this.driver.wait(until.elementLocated(this.deleteSettingsIcon), 10000);
        await this.driver.wait(until.elementIsVisible(deleteIconElement), 5000);
        await this.driver.wait(until.elementIsEnabled(deleteIconElement), 5000);
        await deleteIconElement.click();
        console.log("'Delete Settings' icon successfully clicked.");
    }
}

module.exports = RuleCreationPage;
