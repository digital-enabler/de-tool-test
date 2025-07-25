const { By, until, Key } = require("selenium-webdriver");

class RuleCreationPage {
  constructor(driver) {
    this.driver = driver;
    this.ruleNameClickableContainer = By.css(
      ".v-overlay__content .v-input__control"
    ); // Selettore per il contenitore cliccabile (quello che l'utente vede e clicca)
    this.ruleNameInputActual = By.css(
      '.v-overlay__content input[name="ruleName"]'
    ); // Selettore per l'input effettivo (quello con opacity: 0, dove invieremo il testo)
    this.save_button = By.css(".v-card-actions .v-btn.text-secondary"); // selettore del bottone Save nella modale
    this.menuOptions = By.css(".v-overlay .v-list-item-title"); // opzioni menu
    this.emailToField = By.css('input[name="emailTo"]'); // text field campo To
    this.emailSubjectField = By.css('input[name="emailSubject"]'); // text field campo Subject
    this.saveButtonOnAction = By.xpath("//button[.//span[text()='Save']]"); // save button all'interno del div con i campi da compilare
    this.actionScrollableContainer = By.css(".v-card.overflow-y-auto"); // selettore div scrollbar
    this.telegramChatIdField = By.xpath(
      "//label[text()='Chat ID']/following-sibling::input"
    ); // selettore campo di testo chat id telegram
    this.telegramMessageField = By.xpath(
      "//label[text()='Message']/following-sibling::textarea"
    ); // selettore campo di testo message telegram
    this.webhookUrlField = By.xpath(
      "//label[text()='URL']/following-sibling::input"
    ); // selettore campo di testo url webhook
    this.kafkaHostField = By.xpath(
      "//label[text()='Host']/following-sibling::input"
    ); // selettore campo di testo host kafka
    this.kafkaPortField = By.xpath(
      "//label[text()='Port']/following-sibling::input"
    ); // selettore campo di testo port kafka
    this.kafkaTopicNameField = By.xpath(
      "//label[text()='Topic name']/following-sibling::input"
    ); // selettore campo di test topic name kafka
    this.kafkaValueField = By.xpath(
      "//label[text()='Value']/following-sibling::textarea"
    ); // selettore campo di test value kafka
  }

  //metodo per riempimento text field nome regola prima modale
  async fillRuleName(newName) {
    let inputElement;
    let containerElement;

    console.log(
      "Attendo che il contenitore cliccabile del campo nome regola sia presente e visibile..."
    );

    // 1. Aspetta che il CONTENITORE cliccabile sia localizzato, visibile e abilitato
    containerElement = await this.driver.wait(
      until.elementLocated(this.ruleNameClickableContainer),
      15000 // Timeout per la localizzazione del contenitore
    );

    await this.driver.wait(
      until.elementIsVisible(containerElement),
      10000 // Timeout per la visibilità del contenitore
    );

    await this.driver.wait(
      until.elementIsEnabled(containerElement),
      10000 // Timeout per l'abilitazione del contenitore
    );

    console.log("Contenitore campo nome regola trovato e pronto per il click.");

    // Clicca sul CONTENITORE. Questo dovrebbe attivare l'input interno.
    await containerElement.click();
    console.log("Cliccato sul contenitore del campo nome regola.");

    // Potrebbe essere utile un piccolo sleep dopo il click sul contenitore per dare tempo all'input di diventare "pronto" anche se è trasparente.
    await this.driver.sleep(500);

    console.log(
      "Ora attendo che l'input effettivo (trasparente) sia localizzato e abilitato..."
    );

    // 2. Aspetta che l'INPUT EFFETTIVO (quello con opacity: 0) sia localizzato e abilitato. NON usiamo until.elementIsVisible qui, perché sappiamo che ha opacity: 0
    inputElement = await this.driver.wait(
      until.elementLocated(this.ruleNameInputActual),
      10000 // Timeout per la localizzazione dell'input effettivo
    );

    await this.driver.wait(
      until.elementIsEnabled(inputElement),
      10000 // Timeout per l'abilitazione dell'input effettivo
    );

    console.log(
      "Input campo nome regola trovato e abilitato (anche se trasparente)."
    );

    // Pulisci il campo (gestendo eventuali errori)
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

    // Inserisci il nuovo nome della regola.
    await inputElement.sendKeys(newName);
    console.log(`Testo "${newName}" inserito nel campo nome regola.`);
  }

  //tasto save prima modale
  async clickSave() {
    const btn = await this.driver.wait(
      until.elementLocated(this.save_button),
      5000
    );
    await btn.click();
    console.log("Save cliccato, regola salvata!");
  }

  //metodo per menu select prima modale
  async selectMenu(text) {
    console.log(`Tentando di selezionare l'opzione "${text}" dalla select...`);

    const selectContainerLocator = By.css(
      ".v-overlay .v-input.v-select .v-field"
    );
    let selectContainerElement; // Rinomino per chiarezza

    try {
      // 1. Cerca il contenitore cliccabile della select.
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

      // *** NUOVO APPROCCIO: ESEGUI DISPATCH DELL'EVENTO MOUSEDOWN ***
      // Utilizziamo executeScript sull'elemento Selenium che abbiamo già trovato.
      await this.driver.executeScript(
        "arguments[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));",
        selectContainerElement
      );
      console.log(
        "Evento mousedown dispatchato sul contenitore della select. Attendendo che le opzioni siano visibili..."
      );
      await this.driver.sleep(1000); // Concede tempo al DOM per renderizzare il menu

      // 2. Aspetta che il menu dropdown con le opzioni appaia e sia visibile.
      // Usiamo il selettore più comune per il contenitore del menu attivo.
      console.log(
        "Attendendo che il menu delle opzioni sia presente e visibile..."
      );
      const menuOptionsContainerLocator = By.css(".v-overlay .v-list");
      const menuOptionsContainer = await this.driver.wait(
        until.elementLocated(menuOptionsContainerLocator),
        20000 // Aumento significativo del timeout per il debug
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
      throw error; // Rilancia l'errore per far fallire il test
    }
  }

  //DA VERIFICARE!!!
  async clickAndTypeById(id, text) {
    const input = await this.driver.wait(until.elementLocated(By.id(id)), 5000);
    await input.click();
    await input.clear();
    await input.sendKeys(text);
  }

  //per cliccare sulle option delle select
  async clickMenuOptionByText(text) {
    await this.driver.wait(async () => {
      const options = await this.driver.findElements(this.menuOptions);
      return options.length > 0;
    }, 5000);

    //ciclo for per ciclare le opzioni e quindi sceglierle dinamicamente in base alla scelta fatta ogni volta
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

  //click sulla card degli asset in base al testo
  async clickCardByText(cardText) {
    console.log(`Cercando la card con testo: "${cardText}"`);

    // Selettore generico per tutte le card con la classe fornita
    const allCardsLocator = By.css(
      ".v-card.v-card--link.v-theme--light.bg-primary.lighten-4.v-card--density-default.v-card--variant-elevated.ma-2"
    );

    // XPath per trovare un elemento che contenga il testo specifico all'interno di una card
    // Questo XPath cerca la card che contiene un elemento (es. un div, span, h1, etc.)
    // il cui testo normalizzato (senza spazi extra) corrisponde a `cardText`.
    const cardWithTextLocator = By.xpath(
      `//div[contains(@class, 'v-card--link') and contains(@class, 'v-card') and .//*[normalize-space(text())='${cardText}']]`
    );

    let cardToClick;
    try {
      // Aspetta che la card con il testo specifico sia presente nel DOM
      cardToClick = await this.driver.wait(
        until.elementLocated(cardWithTextLocator),
        15000 // Aumento il timeout, potrebbero esserci molte card o un caricamento lento
      );
      // Aspetta che la card sia visibile e cliccabile
      await this.driver.wait(until.elementIsVisible(cardToClick), 5000);
      await this.driver.wait(until.elementIsEnabled(cardToClick), 5000);

      // Clicca sulla card trovata. Un click nativo dovrebbe funzionare bene qui.
      await cardToClick.click();
      console.log(`Card con testo "${cardText}" cliccata con successo.`);
    } catch (error) {
      console.error(
        `Errore nel cliccare la card con testo "${cardText}":`,
        error.message
      );
      throw error; // Rilancia l'errore per far fallire il test
    }
  }

  //click sulla freccia dell'asset list
  async clickRightArrowButton() {
    console.log("Cercando e cliccando sul bottone con la freccia destra...");

    // Selettore CSS per l'elemento <i> che ha la classe 'mdi-arrow-right-bold-circle'
    const arrowButtonLocator = By.css("i.mdi-arrow-right-bold-circle");

    let arrowButton;
    try {
      // Attende che il bottone sia presente nel DOM
      arrowButton = await this.driver.wait(
        until.elementLocated(arrowButtonLocator),
        10000 // Timeout di 10 secondi per localizzare l'elemento
      );
      // Attende che il bottone sia visibile
      await this.driver.wait(until.elementIsVisible(arrowButton), 5000);
      // Attende che il bottone sia abilitato al click
      await this.driver.wait(until.elementIsEnabled(arrowButton), 5000);

      // Esegue il click sul bottone
      await arrowButton.click();
      console.log("Bottone con la freccia destra cliccato con successo.");
    } catch (error) {
      console.error(
        `Errore nel cliccare il bottone con la freccia destra:`,
        error.message
      );
      throw error; // Rilancia l'errore per far fallire il test
    }
  }

  async clickButtonByText(text) {
    console.log(`Cercando e cliccando sul bottone con testo: "${text}"`);

    // Aspetta che almeno un bottone sia presente nel DOM.
    // Questo è un controllo di robustezza per evitare di cercare in un DOM vuoto.
    await this.driver.wait(async () => {
      const buttons = await this.driver.findElements(By.css("button"));
      return buttons.length > 0;
    }, 10000); // Aumento il timeout a 10 secondi per questa attesa iniziale

    // Prendi tutti i bottoni <button> presenti nel DOM
    const buttons = await this.driver.findElements(By.css("button"));

    for (const button of buttons) {
      try {
        // Tenta di ottenere il testo visibile del bottone.
        // Alcuni bottoni potrebbero non avere testo visibile direttamente (es. solo icone),
        // o potrebbero non essere completamente renderizzati.
        const btnText = await button.getText();

        // Controllo robusto: il bottone deve essere visibile e abilitato
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
          return; // Bottone trovato e cliccato, esci dal metodo
        }
      } catch (e) {
        // Ignora errori se il bottone non è completamente renderizzato o non ha testo.
        // Questo permette di continuare la ricerca tra gli altri bottoni.
        // console.warn(`Errore durante l'analisi di un bottone: ${e.message}`); // Solo per debug approfondito
      }
    }

    // Se il ciclo termina senza aver trovato e cliccato il bottone
    throw new Error(
      `Bottone con testo "${text}" non trovato o non cliccabile.`
    );
  }

  async selectMenuInRowByTdIndex(tdIndex) {
    console.log(`Tentando di aprire la select nella ${tdIndex}° <td>...`);

    // Selettore XPath per la <td> specifica e, al suo interno, il contenitore cliccabile della select.
    // Abbiamo il <tr class="mt-2" height="80px">.
    // Poi selezioniamo la <td> all'indice specificato.
    // E infine, cerchiamo il div della select (.v-input.v-select) e il suo v-field cliccabile.
    const selectContainerLocator = By.xpath(
      `//tr[@class='mt-2' and @height='80px']/td[${tdIndex}]` +
        `//div[contains(@class, 'v-input') and contains(@class, 'v-select')]//div[contains(@class, 'v-field')]`
    );

    let selectContainerElement;

    try {
      // 1. Cerca il contenitore cliccabile della select all'interno della <td> specificata.
      selectContainerElement = await this.driver.wait(
        until.elementLocated(selectContainerLocator),
        15000 // Timeout per la localizzazione dell'elemento
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

      // 2. Simula l'evento 'mousedown' per aprire il dropdown, cruciale per Vuetify.
      await this.driver.executeScript(
        "arguments[0].dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));",
        selectContainerElement
      );
      console.log(
        `Evento mousedown dispatchato sulla select nella ${tdIndex}° <td>. Attendendo che le opzioni siano visibili...`
      );
      await this.driver.sleep(1000); // Concede tempo al DOM per renderizzare il menu

      // 3. Aspetta che il menu dropdown con le opzioni appaia e sia visibile.
      // Il selettore universale `.v-overlay .v-list` dovrebbe funzionare.
      console.log(
        "Attendendo che il menu delle opzioni sia presente e visibile..."
      );
      const menuOptionsContainerLocator = By.css(".v-overlay .v-list");
      const menuOptionsContainer = await this.driver.wait(
        until.elementLocated(menuOptionsContainerLocator),
        20000 // Timeout più lungo per l'apparizione del menu
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

  async fillTextFieldInRowByTdIndex(tdIndex, value) {
    console.log(
      `Tentando di inserire "${value}" nel text field della ${tdIndex}° <td>...`
    );

    // Selettore XPath per la <td> specifica e, al suo interno, l'input field.
    // Cerca la <tr class="mt-2" height="80px">.
    // Poi seleziona la <td> all'indice specificato.
    // E infine, cerca l'input con classe 'v-field__input' all'interno di un div con 'v-text-field'.
    const textFieldLocator = By.xpath(
      `//tr[@class='mt-2' and @height='80px']/td[${tdIndex}]` +
        `//div[contains(@class, 'v-text-field')]//input[contains(@class, 'v-field__input')]`
    );

    let textFieldElement;

    try {
      // 1. Cerca il text field specifico all'interno della <td>.
      textFieldElement = await this.driver.wait(
        until.elementLocated(textFieldLocator),
        15000 // Timeout per la localizzazione dell'elemento
      );
      await this.driver.wait(until.elementIsVisible(textFieldElement), 5000);
      await this.driver.wait(until.elementIsEnabled(textFieldElement), 5000);

      console.log(
        `Text field nella ${tdIndex}° <td> trovato e pronto per l'input.`
      );

      // 2. Cancella il contenuto esistente (se presente)
      await textFieldElement.clear();
      console.log("Contenuto del text field cancellato.");

      // 3. Inserisci il nuovo valore
      await textFieldElement.sendKeys(value);
      console.log(
        `Valore "${value}" inserito nel text field della ${tdIndex}° <td>.`
      );

      // Opzionale: simula un 'tab' o 'enter' per de-focalizzare il campo, se necessario
      // await textFieldElement.sendKeys(Key.TAB);
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

  async mailAction(mailDetails = {}) {
    console.log('--- Inizio esecuzione dell\'azione "E-Mail" ---');

    // === PARTE 1: Cliccare sulla card "E-Mail" ===
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

    // === PARTE 2: Compilare i campi che sono apparsi nella pagina ===
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

    // === NUOVO PASSO: SCROLL DEL CONTENITORE ===
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

    // === PARTE 3: Clicca sul tasto SAVE ===
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

  async handleConfirmationModal() {
    console.log("--- Gestione della modale di conferma ---");

    // Attendiamo che la modale appaia (usiamo un selettore generico per le overlay di Vuetify)
    const modalLocator = By.css(".v-overlay__content");
    await this.driver.wait(until.elementLocated(modalLocator), 10000);
    console.log("Modale di conferma trovata.");

    // Usiamo il selettore CSS che hai fornito, combinato con una logica di ricerca per il testo.
    const saveButtonInModalLocator = By.css(
      ".v-overlay__content .v-btn.v-btn--slim"
    );

    // Cerca tutti i bottoni che corrispondono al selettore
    console.log('Cercando il bottone "Save" nella modale di conferma...');
    const buttons = await this.driver.wait(
      until.elementsLocated(saveButtonInModalLocator),
      10000
    );

    let saveButton;
    // Iteriamo tra i bottoni per trovare quello con il testo "Save"
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

    // Attendiamo che il bottone trovato sia cliccabile
    await this.driver.wait(until.elementIsVisible(saveButton), 5000);
    await this.driver.wait(until.elementIsEnabled(saveButton), 5000);

    console.log(
      'Trovato e cliccando sul bottone "Save" della modale di conferma.'
    );
    await saveButton.click();

    // Attendiamo che la modale si chiuda
    await this.driver.wait(until.stalenessOf(saveButton), 5000);
    console.log("Modale di conferma chiusa con successo.");
  }

  async telegramAction(telegramDetails = {}) {
    console.log('--- Inizio esecuzione dell\'azione "Telegram" ---');

    // === PARTE 1: Cliccare sulla card "TELEGRAM" ===
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

    // === PARTE 2: Compilare i campi specifici di Telegram ===

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

    // === PARTE 3: Eseguire la logica comune di scroll e salvataggio ===
    // Questi selettori (this.actionScrollableContainer e this.saveButtonOnAction)
    // devono essere definiti nel constructor della tua classe RuleCreationPage.

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

  async webhookAction(webhookDetails = {}) {
    console.log('--- Inizio esecuzione dell\'azione "Webhook" ---');

    // === PARTE 1: Cliccare sulla card "WEBHOOK" ===
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

    // === PARTE 2: Compilare i campi che sono apparsi nella pagina ===

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

    // === PARTE 3: SCROLL DEL CONTENITORE COMUNE ===

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

    // === PARTE 4: Clicca sul tasto SAVE COMUNE ===.

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

  async kafkaAction(kafkaDetails = {}) {
    console.log('--- Inizio esecuzione dell\'azione "Kafka" ---');

    // === PARTE 1: Cliccare sulla card "KAFKA" ===
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

    // === PARTE 2: Compilare i campi che sono apparsi nella pagina ===

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
    await portElement.sendKeys(String(kafkaDetails.port)); // Converti a stringa per sendKeys

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

    // === PARTE 3: SCROLL DEL CONTENITORE COMUNE ===
    // Il selettore this.actionScrollableContainer deve essere definito nel constructor.

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

    // === PARTE 4: Clicca sul tasto SAVE COMUNE ===

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
