const { By, until, Key } = require("selenium-webdriver");

class RuleCreationPage {
  constructor(driver) {
    this.driver = driver;
    this.ruleNameClickableContainer = By.css(
      ".v-overlay__content .v-input__control"
    ); // Selector for the clickable container (the one the user sees and clicks)
    this.ruleNameInputActual = By.css(
      '.v-overlay__content input[name="ruleName"]'
    ); // Selector for the actual input (the one with opacity: 0, where we will send the text)
    this.save_button = By.css(".v-card-actions .v-btn.text-secondary"); // Save button selector in the modal
    this.menuOptions = By.css(".v-overlay .v-list-item-title"); // menu options
    this.emailToField = By.css('input[name="emailTo"]'); // text field To
    this.emailSubjectField = By.css('input[name="emailSubject"]'); // text field Subject
    this.saveButtonOnAction = By.xpath("//button[.//span[text()='Save']]"); // save button within the div with the fields to be filled in
    this.actionScrollableContainer = By.css(".v-card.overflow-y-auto"); // selector div scrollbar
    this.telegramChatIdField = By.xpath(
      "//label[text()='Chat ID']/following-sibling::input"
    ); // chat id telegram text field selector
    this.telegramMessageField = By.xpath(
      "//label[text()='Message']/following-sibling::textarea"
    ); // message telegram text field selector
    this.webhookUrlField = By.xpath(
      "//label[text()='URL']/following-sibling::input"
    ); // url webhook text field selector
    this.kafkaHostField = By.xpath(
      "//label[text()='Host']/following-sibling::input"
    ); // host kafka text field selector
    this.kafkaPortField = By.xpath(
      "//label[text()='Port']/following-sibling::input"
    ); // port kafka text field selector
    this.kafkaTopicNameField = By.xpath(
      "//label[text()='Topic name']/following-sibling::input"
    ); // topic name kafka text field selector
    this.kafkaValueField = By.xpath(
      "//label[text()='Value']/following-sibling::textarea"
    ); // value kafka text field selector
  }

  // method for filling text field name rule first modal
  async fillRuleName(newName) {
    let inputElement;
    let containerElement;

    console.log(
      "Attendo che il contenitore cliccabile del campo nome regola sia presente e visibile..."
    );

    containerElement = await this.driver.wait(
      until.elementLocated(this.ruleNameClickableContainer),
      15000 
    );

    await this.driver.wait(
      until.elementIsVisible(containerElement),
      10000 
    );

    await this.driver.wait(
      until.elementIsEnabled(containerElement),
      10000 
    );

    console.log("Contenitore campo nome regola trovato e pronto per il click.");

    await containerElement.click();
    console.log("Cliccato sul contenitore del campo nome regola.");

    await this.driver.sleep(500);

    console.log(
      "Ora attendo che l'input effettivo (trasparente) sia localizzato e abilitato..."
    );

    inputElement = await this.driver.wait(
      until.elementLocated(this.ruleNameInputActual),
      10000
    );

    await this.driver.wait(
      until.elementIsEnabled(inputElement),
      10000 
    );

    console.log(
      "Input campo nome regola trovato e abilitato (anche se trasparente)."
    );

    try {
      await inputElement.sendKeys(Key.chord(Key.CONTROL, "a"));
      await inputElement.sendKeys(Key.BACK_SPACE);
      console.log("Campo nome regola pulito.");
    } catch (e) {
      console.warn(
        "Impossibile pulire il campo, provando a sovrascrivere. Errore:",
        e.message
      );
    }

    await inputElement.sendKeys(newName);
    console.log(`Testo "${newName}" inserito nel campo nome regola.`);
  }

  // save button on first modal
  async clickSave() {
    const btn = await this.driver.wait(
      until.elementLocated(this.save_button),
      5000
    );
    await btn.click();
    console.log("Save cliccato, regola salvata!");
  }

  // method for select menu on first modal
  async selectMenu(text) {
    console.log(`Tentando di selezionare l'opzione "${text}" dalla select...`);

    const selectContainerLocator = By.css(
      ".v-overlay .v-input.v-select .v-field"
    );
    let selectContainerElement;

    try {
      selectContainerElement = await this.driver.wait(
        until.elementLocated(selectContainerLocator),
        10000
      );
      await this.driver.wait(
        until.elementIsVisible(selectContainerElement),
        5000
      );
      await this.driver.wait(
        until.elementIsEnabled(selectContainerElement),
        5000
      );

      console.log("Contenitore della select trovato e cliccabile.");

      await this.driver.executeScript(
        "arguments[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));",
        selectContainerElement
      );
      console.log(
        "Evento mousedown dispatchato sul contenitore della select. Attendendo che le opzioni siano visibili..."
      );
      await this.driver.sleep(1000); 

      console.log(
        "Attendendo che il menu delle opzioni sia presente e visibile..."
      );
      const menuOptionsContainerLocator = By.css(".v-overlay .v-list");
      const menuOptionsContainer = await this.driver.wait(
        until.elementLocated(menuOptionsContainerLocator),
        20000 
      );
      await this.driver.wait(
        until.elementIsVisible(menuOptionsContainer),
        10000
      );
      console.log("Menu delle opzioni della select visibile.");
    } catch (error) {
      console.error(
        `Errore durante la selezione dell'opzione "${text}":`,
        error.message
      );
      console.log(
        "Assicurati che il testo dell'opzione sia corretto e che il menu appaia correttamente nel DOM."
      );
      throw error; 
    }
  }

  // click on option of select menu
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

  // click on the asset card according to the text
  async clickCardByText(cardText) {
    console.log(`Cercando la card con testo: "${cardText}"`);

    const allCardsLocator = By.css(
      ".v-card.v-card--link.v-theme--light.bg-primary.lighten-4.v-card--density-default.v-card--variant-elevated.ma-2"
    );

    const cardWithTextLocator = By.xpath(
      `//div[contains(@class, 'v-card--link') and contains(@class, 'v-card') and .//*[normalize-space(text())='${cardText}']]`
    );

    let cardToClick;
    try {
      cardToClick = await this.driver.wait(
        until.elementLocated(cardWithTextLocator),
        15000 
      );
      await this.driver.wait(until.elementIsVisible(cardToClick), 5000);
      await this.driver.wait(until.elementIsEnabled(cardToClick), 5000);

      await cardToClick.click();
      console.log(`Card con testo "${cardText}" cliccata con successo.`);
    } catch (error) {
      console.error(
        `Errore nel cliccare la card con testo "${cardText}":`,
        error.message
      );
      throw error; 
    }
  }

  // click on the asset list arrow
  async clickRightArrowButton() {
    console.log("Cercando e cliccando sul bottone con la freccia destra...");

    const arrowButtonLocator = By.css("i.mdi-arrow-right-bold-circle");

    let arrowButton;
    try {
      arrowButton = await this.driver.wait(
        until.elementLocated(arrowButtonLocator),
        10000 
      );
      
      await this.driver.wait(until.elementIsVisible(arrowButton), 5000);
      
      await this.driver.wait(until.elementIsEnabled(arrowButton), 5000);

      await arrowButton.click();
      console.log("Bottone con la freccia destra cliccato con successo.");
    } catch (error) {
      console.error(
        `Errore nel cliccare il bottone con la freccia destra:`,
        error.message
      );
      throw error; 
    }
  }

  // click on button according to the text
  async clickButtonByText(text) {
    console.log(`Cercando e cliccando sul bottone con testo: "${text}"`);

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

        if (
          isVisible &&
          isEnabled &&
          btnText.trim().toLowerCase() === text.toLowerCase()
        ) {
          console.log(`Trovato bottone "${text}". Tentando il click.`);
          await button.click();
          console.log(`Bottone "${text}" cliccato con successo.`);
          return; 
        }
      } catch (e) {
      }
    }

    throw new Error(
      `Bottone con testo "${text}" non trovato o non cliccabile.`
    );
  }

  // click on select menu according to td index in table
  async selectMenuInRowByTdIndex(tdIndex) {
    console.log(`Tentando di aprire la select nella ${tdIndex}° <td>...`);

    const selectContainerLocator = By.xpath(
      `//tr[@class='mt-2' and @height='80px']/td[${tdIndex}]` +
        `//div[contains(@class, 'v-input') and contains(@class, 'v-select')]//div[contains(@class, 'v-field')]`
    );

    let selectContainerElement;

    try {
      selectContainerElement = await this.driver.wait(
        until.elementLocated(selectContainerLocator),
        15000 
      );
      await this.driver.wait(
        until.elementIsVisible(selectContainerElement),
        5000
      );
      await this.driver.wait(
        until.elementIsEnabled(selectContainerElement),
        5000
      );

      console.log(
        `Contenitore della select nella ${tdIndex}° <td> trovato e cliccabile.`
      );

      await this.driver.executeScript(
        "arguments[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));",
        selectContainerElement
      );
      console.log(
        `Evento mousedown dispatchato sulla select nella ${tdIndex}° <td>. Attendendo che le opzioni siano visibili...`
      );
      await this.driver.sleep(1000); 

      console.log(
        "Attendendo che il menu delle opzioni sia presente e visibile..."
      );
      const menuOptionsContainerLocator = By.css(".v-overlay .v-list");
      const menuOptionsContainer = await this.driver.wait(
        until.elementLocated(menuOptionsContainerLocator),
        20000 
      );
      await this.driver.wait(
        until.elementIsVisible(menuOptionsContainer),
        10000
      );
      console.log("Menu delle opzioni della select visibile.");
    } catch (error) {
      console.error(
        `Errore durante l'apertura della select nella ${tdIndex}° <td>:`,
        error.message
      );
      console.log(
        "Verifica che l'indice della <td> sia corretto e che la struttura HTML non sia cambiata."
      );
      throw error;
    }
  }

  // fill text field accordint to td index in table
  async fillTextFieldInRowByTdIndex(tdIndex, value) {
    console.log(
      `Tentando di inserire "${value}" nel text field della ${tdIndex}° <td>...`
    );

    const textFieldLocator = By.xpath(
      `//tr[@class='mt-2' and @height='80px']/td[${tdIndex}]` +
        `//div[contains(@class, 'v-text-field')]//input[contains(@class, 'v-field__input')]`
    );

    let textFieldElement;

    try {
      textFieldElement = await this.driver.wait(
        until.elementLocated(textFieldLocator),
        15000 
      );
      await this.driver.wait(until.elementIsVisible(textFieldElement), 5000);
      await this.driver.wait(until.elementIsEnabled(textFieldElement), 5000);

      console.log(
        `Text field nella ${tdIndex}° <td> trovato e pronto per l'input.`
      );

      await textFieldElement.clear();
      console.log("Contenuto del text field cancellato.");

      await textFieldElement.sendKeys(value);
      console.log(
        `Valore "${value}" inserito nel text field della ${tdIndex}° <td>.`
      );

    } catch (error) {
      console.error(
        `Errore durante l'inserimento del valore nel text field della ${tdIndex}° <td>:`,
        error.message
      );
      console.log(
        "Verifica che l'indice della <td> sia corretto e che la struttura HTML del text field non sia cambiata."
      );
      throw error;
    }
  }

  // mail action
  async mailAction(mailDetails = {}) {
    console.log('--- Inizio esecuzione dell\'azione "E-Mail" ---');

    // Click on "E-Mail" card
    const cardText = "E-MAIL";
    console.log(`Cercando e cliccando la Action Card con testo: "${cardText}"`);
    const actionCardWithTextLocator = By.xpath(
      `//div[contains(@class, 'v-card--link') and contains(@class, 'v-card') ` +
        `and contains(@class, 'bg-secondary') and contains(@class, 'lighten-4') ` +
        `and .//*[normalize-space(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'))='${cardText.toLowerCase()}']]`
    );
    let cardToClick;
    try {
      console.log("Attesa di 1 secondo per il rendering della Action Card...");
      await this.driver.sleep(1000);
      cardToClick = await this.driver.wait(
        until.elementLocated(actionCardWithTextLocator),
        20000
      );
      await this.driver.wait(until.elementIsVisible(cardToClick), 10000);
      await this.driver.wait(until.elementIsEnabled(cardToClick), 10000);
      await cardToClick.click();
      console.log(`Action Card con testo "${cardText}" cliccata con successo.`);
      await this.driver.sleep(1000);
    } catch (error) {
      console.error(
        `Errore nel cliccare la Action Card con testo "${cardText}":`,
        error.message
      );
      throw error;
    }

    // Completing Email-specific fields
    if (!mailDetails.to) {
      throw new Error(
        'Il destinatario ("to" field) è un campo obbligatorio per l\'azione E-Mail e non è stato fornito.'
      );
    }
    console.log(`Inserendo destinatario: ${mailDetails.to}`);
    const toElement = await this.driver.wait(
      until.elementLocated(this.emailToField),
      10000
    );
    await toElement.clear();
    await toElement.sendKeys(mailDetails.to);

    if (!mailDetails.subject) {
      throw new Error(
        "L'oggetto è un campo obbligatorio per l'azione E-Mail e non è stato fornito."
      );
    }
    console.log(`Inserendo oggetto: ${mailDetails.subject}`);
    const subjectElement = await this.driver.wait(
      until.elementLocated(this.emailSubjectField),
      10000
    );
    await subjectElement.clear();
    await subjectElement.sendKeys(mailDetails.subject);

    // Container scroll
    console.log(
      "Scorrendo il contenitore dell'azione E-Mail per visualizzare il tasto SAVE..."
    );
    try {
      const scrollableElement = await this.driver.wait(
        until.elementLocated(this.actionScrollableContainer),
        5000
      );
      await this.driver.executeScript(
        "arguments[0].scrollTop = arguments[0].scrollHeight",
        scrollableElement
      );
      await this.driver.sleep(500);
      console.log("Scroll del contenitore eseguito con successo.");
    } catch (scrollError) {
      console.warn(
        "Attenzione: Impossibile trovare o scorrere il contenitore specifico per l'azione E-Mail.",
        scrollError.message
      );
      await this.driver.executeScript("window.scrollBy(0, 500)");
    }
    await this.driver.sleep(2000);

    // Click on save button
    const shouldSave = mailDetails.save === undefined ? true : mailDetails.save;
    if (shouldSave) {
      console.log("Cliccando sul tasto SAVE per l'azione E-Mail...");
      const saveButton = await this.driver.wait(
        until.elementLocated(this.saveButtonOnAction),
        15000
      );
      await this.driver.wait(until.elementIsVisible(saveButton), 5000);
      console.log(
        "Trovato bottone SAVE. Attendendo che non sia più disabilitato..."
      );
      await this.driver.wait(
        async () => {
          const disabledAttribute = await saveButton.getAttribute("disabled");
          return disabledAttribute === null;
        },
        15000,
        "Il bottone SAVE è rimasto disabilitato troppo a lungo."
      );
      console.log("Il bottone SAVE è ora abilitato. Tentando il click.");
      await saveButton.click();
      console.log("Tasto SAVE dell'azione E-Mail cliccato.");
    } else {
      console.log("Skippando il click sul tasto SAVE per l'azione E-Mail.");
    }
    console.log('--- Azione "E-Mail" completata. ---');
  }

  // handle confirmation modal
  async handleConfirmationModal() {
    console.log("--- Gestione della modale di conferma ---");

    // We wait for the modal to appear (we use a generic Vuetify overlay selector)
    const modalLocator = By.css(".v-overlay__content");
    await this.driver.wait(until.elementLocated(modalLocator), 10000);
    console.log("Modale di conferma trovata.");

    const saveButtonInModalLocator = By.css(
      ".v-overlay__content .v-btn.v-btn--slim"
    );

    //  Search for all buttons that match the selector
    console.log('Cercando il bottone "Save" nella modale di conferma...');
    const buttons = await this.driver.wait(
      until.elementsLocated(saveButtonInModalLocator),
      10000
    );

    let saveButton;
    // Iterate between the buttons to find the one with the text “Save”.
    for (const button of buttons) {
      const buttonText = await button.getText();
      if (buttonText.trim() === "SAVE") {
        saveButton = button;
        break;
      }
    }

    if (!saveButton) {
      throw new Error(
        'Impossibile trovare il bottone "Save" nella modale di conferma.'
      );
    }

    // We wait for the button found to be clickable
    await this.driver.wait(until.elementIsVisible(saveButton), 5000);
    await this.driver.wait(until.elementIsEnabled(saveButton), 5000);

    console.log(
      'Trovato e cliccando sul bottone "Save" della modale di conferma.'
    );
    await saveButton.click();

    // We wait for the modal to close
    await this.driver.wait(until.stalenessOf(saveButton), 5000);
    console.log("Modale di conferma chiusa con successo.");
  }

  // telegram action
  async telegramAction(telegramDetails = {}) {
    console.log('--- Inizio esecuzione dell\'azione "Telegram" ---');

    // Click on "TELEGRAM" card
    const cardText = "TELEGRAM";
    console.log(`Cercando e cliccando la Action Card con testo: "${cardText}"`);
    const actionCardWithTextLocator = By.xpath(
      `//div[contains(@class, 'v-card--link') and contains(@class, 'v-card') ` +
        `and contains(@class, 'bg-secondary') and contains(@class, 'lighten-4') ` +
        `and .//*[normalize-space(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'))='${cardText.toLowerCase()}']]`
    );
    let cardToClick;
    try {
      await this.driver.sleep(1000);
      cardToClick = await this.driver.wait(
        until.elementLocated(actionCardWithTextLocator),
        20000
      );
      await this.driver.wait(until.elementIsVisible(cardToClick), 10000);
      await this.driver.wait(until.elementIsEnabled(cardToClick), 10000);
      await cardToClick.click();
      console.log(`Action Card con testo "${cardText}" cliccata con successo.`);
      await this.driver.sleep(1000);
    } catch (error) {
      console.error(
        `Errore nel cliccare la Action Card con testo "${cardText}":`,
        error.message
      );
      throw error;
    }

    // Completing Telegram-specific fields

    if (!telegramDetails.chatId) {
      throw new Error(
        'Il "Chat ID" è un campo obbligatorio per l\'azione Telegram e non è stato fornito.'
      );
    }
    console.log(`Inserendo Chat ID: ${telegramDetails.chatId}`);
    const chatIdElement = await this.driver.wait(
      until.elementLocated(this.telegramChatIdField),
      10000
    );
    await chatIdElement.clear();
    await chatIdElement.sendKeys(telegramDetails.chatId);

    if (!telegramDetails.message) {
      throw new Error(
        "Il campo 'Message' è un campo obbligatorio per l'azione Telegram e non è stato fornito."
      );
    }
    console.log(`Inserendo il messaggio: ${telegramDetails.message}`);
    const messageElement = await this.driver.wait(
      until.elementLocated(this.telegramMessageField),
      10000
    );
    await messageElement.clear();
    await messageElement.sendKeys(telegramDetails.message);

    // Execute common scroll and save logic
    console.log(
      "Scorrendo il contenitore dell'azione per visualizzare il tasto SAVE..."
    );
    try {
      const scrollableElement = await this.driver.wait(
        until.elementLocated(this.actionScrollableContainer),
        5000
      );
      await this.driver.executeScript(
        "arguments[0].scrollTop = arguments[0].scrollHeight",
        scrollableElement
      );
      await this.driver.sleep(500);
      console.log("Scroll del contenitore eseguito con successo.");
    } catch (scrollError) {
      console.warn(
        "Attenzione: Impossibile trovare o scorrere il contenitore specifico dell'azione.",
        scrollError.message
      );
      await this.driver.executeScript("window.scrollBy(0, 500)");
    }
    await this.driver.sleep(2000);

    console.log("Cliccando sul tasto SAVE...");
    const saveButton = await this.driver.wait(
      until.elementLocated(this.saveButtonOnAction),
      15000
    );
    await this.driver.wait(until.elementIsVisible(saveButton), 5000);
    await this.driver.wait(
      async () => {
        const disabledAttribute = await saveButton.getAttribute("disabled");
        return disabledAttribute === null;
      },
      15000,
      "Il bottone SAVE è rimasto disabilitato troppo a lungo."
    );
    await saveButton.click();
    console.log("Tasto SAVE dell'azione cliccato.");

    console.log('--- Azione "Telegram" completata. ---');
  }

  // webhook action
  async webhookAction(webhookDetails = {}) {
    console.log('--- Inizio esecuzione dell\'azione "Webhook" ---');

    // Click on "WEBHOOK" card
    const cardText = "WEBHOOK";
    console.log(`Cercando e cliccando la Action Card con testo: "${cardText}"`);
    const actionCardWithTextLocator = By.xpath(
      `//div[contains(@class, 'v-card--link') and contains(@class, 'v-card') ` +
        `and contains(@class, 'bg-secondary') and contains(@class, 'lighten-4') ` +
        `and .//*[normalize-space(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'))='${cardText.toLowerCase()}']]`
    );
    let cardToClick;
    try {
      console.log("Attesa di 1 secondo per il rendering della Action Card...");
      await this.driver.sleep(1000);
      cardToClick = await this.driver.wait(
        until.elementLocated(actionCardWithTextLocator),
        20000
      );
      await this.driver.wait(until.elementIsVisible(cardToClick), 10000);
      await this.driver.wait(until.elementIsEnabled(cardToClick), 10000);
      await cardToClick.click();
      console.log(`Action Card con testo "${cardText}" cliccata con successo.`);
      await this.driver.sleep(1000);
    } catch (error) {
      console.error(
        `Errore nel cliccare la Action Card con testo "${cardText}":`,
        error.message
      );
      // Debugging hint
      console.log(
        'DEBUG: Fallimento nel cliccare la card "Webhook". Verifica che sia presente e con le classi corrette.'
      );
      throw error;
    }

    // Completing Webhook-specific fields

    if (!webhookDetails.url) {
      throw new Error(
        "L'URL è un campo obbligatorio per l'azione Webhook e non è stato fornito."
      );
    }
    console.log(`Inserendo URL: ${webhookDetails.url}`);
    const urlElement = await this.driver.wait(
      until.elementLocated(this.webhookUrlField),
      10000
    );
    await urlElement.clear();
    await urlElement.sendKeys(webhookDetails.url);

    // Execute common scroll logic

    console.log(
      "Scorrendo il contenitore dell'azione Webhook per visualizzare il tasto SAVE..."
    );
    try {
      const scrollableElement = await this.driver.wait(
        until.elementLocated(this.actionScrollableContainer),
        5000
      );
      await this.driver.executeScript(
        "arguments[0].scrollTop = arguments[0].scrollHeight",
        scrollableElement
      );
      await this.driver.sleep(500);
      console.log("Scroll del contenitore eseguito con successo.");
    } catch (scrollError) {
      console.warn(
        "Attenzione: Impossibile trovare o scorrere il contenitore specifico per l'azione Webhook.",
        scrollError.message
      );
      await this.driver.executeScript("window.scrollBy(0, 500)");
    }
    await this.driver.sleep(2000);

    // Execute common save logic

    const shouldSave =
      webhookDetails.save === undefined ? true : webhookDetails.save;
    if (shouldSave) {
      console.log("Cliccando sul tasto SAVE per l'azione Webhook...");
      const saveButton = await this.driver.wait(
        until.elementLocated(this.saveButtonOnAction),
        15000
      );
      await this.driver.wait(until.elementIsVisible(saveButton), 5000);
      console.log(
        "Trovato bottone SAVE. Attendendo che non sia più disabilitato..."
      );
      await this.driver.wait(
        async () => {
          const disabledAttribute = await saveButton.getAttribute("disabled");
          return disabledAttribute === null;
        },
        15000,
        "Il bottone SAVE è rimasto disabilitato troppo a lungo."
      );
      console.log("Il bottone SAVE è ora abilitato. Tentando il click.");
      await saveButton.click();
      console.log("Tasto SAVE dell'azione Webhook cliccato.");
    } else {
      console.log("Skippando il click sul tasto SAVE per l'azione Webhook.");
    }
    console.log('--- Azione "Webhook" completata. ---');
  }

  // kafka action
  async kafkaAction(kafkaDetails = {}) {
    console.log('--- Inizio esecuzione dell\'azione "Kafka" ---');

    // Click on "KAFKA" card
    const cardText = "KAFKA";
    console.log(`Cercando e cliccando la Action Card con testo: "${cardText}"`);
    const actionCardWithTextLocator = By.xpath(
      `//div[contains(@class, 'v-card--link') and contains(@class, 'v-card') ` +
        `and contains(@class, 'bg-secondary') and contains(@class, 'lighten-4') ` +
        `and .//*[normalize-space(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'))='${cardText.toLowerCase()}']]`
    );
    let cardToClick;
    try {
      console.log("Attesa di 1 secondo per il rendering della Action Card...");
      await this.driver.sleep(1000);
      cardToClick = await this.driver.wait(
        until.elementLocated(actionCardWithTextLocator),
        20000
      );
      await this.driver.wait(until.elementIsVisible(cardToClick), 10000);
      await this.driver.wait(until.elementIsEnabled(cardToClick), 10000);
      await cardToClick.click();
      console.log(`Action Card con testo "${cardText}" cliccata con successo.`);
      await this.driver.sleep(1000);
    } catch (error) {
      console.error(
        `Errore nel cliccare la Action Card con testo "${cardText}":`,
        error.message
      );
      // Debugging hint
      console.log(
        'DEBUG: Fallimento nel cliccare la card "Kafka". Verifica che sia presente e con le classi corrette.'
      );
      throw error;
    }

    // Completing Kafka-specific fields

    if (!kafkaDetails.host) {
      throw new Error(
        'Il campo "Host" è obbligatorio per l\'azione Kafka e non è stato fornito.'
      );
    }
    console.log(`Inserendo Host: ${kafkaDetails.host}`);
    const hostElement = await this.driver.wait(
      until.elementLocated(this.kafkaHostField),
      10000
    );
    await hostElement.clear();
    await hostElement.sendKeys(kafkaDetails.host);

    if (!kafkaDetails.port) {
      throw new Error(
        'Il campo "Port" è obbligatorio per l\'azione Kafka e non è stato fornito.'
      );
    }
    console.log(`Inserendo Port: ${kafkaDetails.port}`);
    const portElement = await this.driver.wait(
      until.elementLocated(this.kafkaPortField),
      10000
    );
    await portElement.clear();
    await portElement.sendKeys(String(kafkaDetails.port)); // Convert to string for sendKeys

    if (!kafkaDetails.topicName) {
      throw new Error(
        'Il campo "Topic name" è obbligatorio per l\'azione Kafka e non è stato fornito.'
      );
    }
    console.log(`Inserendo Topic name: ${kafkaDetails.topicName}`);
    const topicNameElement = await this.driver.wait(
      until.elementLocated(this.kafkaTopicNameField),
      10000
    );
    await topicNameElement.clear();
    await topicNameElement.sendKeys(kafkaDetails.topicName);

    if (!kafkaDetails.value) {
      throw new Error(
        'Il campo "Value" è obbligatorio per l\'azione Kafka e non è stato fornito.'
      );
    }
    console.log(`Inserendo Value: ${kafkaDetails.value}`);
    const valueElement = await this.driver.wait(
      until.elementLocated(this.kafkaValueField),
      10000
    );
    await valueElement.clear();
    await valueElement.sendKeys(kafkaDetails.value);

    // Execute common scroll logic

    console.log(
      "Scorrendo il contenitore dell'azione Kafka per visualizzare il tasto SAVE..."
    );
    try {
      const scrollableElement = await this.driver.wait(
        until.elementLocated(this.actionScrollableContainer),
        5000
      );
      await this.driver.executeScript(
        "arguments[0].scrollTop = arguments[0].scrollHeight",
        scrollableElement
      );
      await this.driver.sleep(500);
      console.log("Scroll del contenitore eseguito con successo.");
    } catch (scrollError) {
      console.warn(
        "Attenzione: Impossibile trovare o scorrere il contenitore specifico per l'azione Kafka.",
        scrollError.message
      );
      await this.driver.executeScript("window.scrollBy(0, 500)");
    }
    await this.driver.sleep(2000);

    // Execute common save logic

    const shouldSave =
      kafkaDetails.save === undefined ? true : kafkaDetails.save;
    if (shouldSave) {
      console.log("Cliccando sul tasto SAVE per l'azione Kafka...");
      const saveButton = await this.driver.wait(
        until.elementLocated(this.saveButtonOnAction),
        15000
      );
      await this.driver.wait(until.elementIsVisible(saveButton), 5000);
      console.log(
        "Trovato bottone SAVE. Attendendo che non sia più disabilitato..."
      );
      await this.driver.wait(
        async () => {
          const disabledAttribute = await saveButton.getAttribute("disabled");
          return disabledAttribute === null;
        },
        15000,
        "Il bottone SAVE è rimasto disabilitato troppo a lungo."
      );
      console.log("Il bottone SAVE è ora abilitato. Tentando il click.");
      await saveButton.click();
      console.log("Tasto SAVE dell'azione Kafka cliccato.");
    } else {
      console.log("Skippando il click sul tasto SAVE per l'azione Kafka.");
    }
    console.log('--- Azione "Kafka" completata. ---');
  }
}

module.exports = RuleCreationPage;
