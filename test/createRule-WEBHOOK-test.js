const { expect } = require("chai");
const { By, until, Key } = require("selenium-webdriver");
const initHomePageSession = require("../helpers/initHomePageSession");
const RuleCreationPage = require("../pages/rule-creation-pages");

describe("Create Rule Webhook Test", function () {
  this.timeout(60000); // Timeout generale per l'intero test
  let driver, homePage, creationPage;

  before(async function () {
    const sess = await initHomePageSession();
    driver = sess.driver;
    homePage = sess.homePage;
    creationPage = new RuleCreationPage(driver);
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it("should create rule and proceed through all steps", async function () {
    console.log("Inizio test di creazione regola...");

    // 1. Click sul bottone "Create Rule"
    console.log('Cercando il bottone "Create Rule"...');
    const createBtn = await driver.wait(
      until.elementLocated(By.css(".v-btn.v-btn--elevated.text-white")),
      10000
    );
    await driver.wait(until.elementIsVisible(createBtn), 5000);
    await driver.wait(until.elementIsEnabled(createBtn), 5000);
    await createBtn.click();
    console.log('Cliccato su "Create Rule".');

    // Aspetta che la modale di creazione regola sia visibile e pronta
    console.log('Attendendo che la modale "Crea Nuova Regola" sia visibile...');
    const modalTitleElement = await driver.wait(
      until.elementLocated(By.css(".v-toolbar-title__placeholder")),
      10000
    );
    await driver.wait(until.elementIsVisible(modalTitleElement), 5000);
    console.log('Modale "Crea Nuova Regola" è visibile e pronta.');

    // 2. Scrivi il nome della nuova regola
    const newRuleName = "Test Regola Automatica Webhook";
    console.log(`Compilando il nome della regola: ${newRuleName}`);
    await creationPage.fillRuleName(newRuleName);
    console.log("Nome regola compilato.");

    // 3. Seleziona opzione dalla select (questa azione avviene all'interno della stessa modale)
    console.log("Aprendo la select...");
    await creationPage.selectMenu("OptionVisibleText"); // Usa il testo reale che ti aspetti
    console.log("Select menu aperta.");

    console.log("Cliccando sulla option...");
    await creationPage.clickMenuOptionByText("avant");
    console.log("Option selezionata.");

    // 4. Salva (questo dovrebbe chiudere la prima modale)
    console.log('Cliccando sul bottone "Salva" (prima fase)...');
    await creationPage.clickSave();

    //Attesa per la chiusura della modale e il caricamento della pagina successiva
    console.log(
      "Attendendo 3 secondi per la chiusura della modale e il caricamento della pagina successiva..."
    );
    await driver.sleep(3000); // 3 secondi di attesa

    //click sull'asset card
    console.log("Cliccando sulla card in base al testo...");
    await creationPage.clickCardByText("NGSI ENTITY");
    console.log("Card cliccata.");

    // Attesa per il caricamento dell'asset list
    console.log(
      "Attendendo 3 secondi affinchè la lista si carichi correttamente..."
    );
    await driver.sleep(3000); // 3 secondi di attesa

    //click sulla freccia dell'asset list
    console.log(
      "Procedendo con il prossimo passo cliccando sul bottone freccia..."
    );
    await creationPage.clickRightArrowButton();
    console.log("Bottone freccia cliccato.");

    // Attesa affinchè l'asset selezionato si veda in lista
    console.log(
      "Attendendo 3 secondi affinchè la lista degli asset selezionati si carichi correttamente..."
    );
    await driver.sleep(3000); // 3 secondi di attesa

    //click sul bottone continue
    console.log(
      'Cliccando sul bottone "Continue" per andare al prossimo step...'
    );
    await creationPage.clickButtonByText("CONTINUE"); // Passa il testo esatto del bottone
    console.log('Bottone "Continue" cliccato.');

    // Attesa affinchè si carichi la pagina delle conditions
    console.log(
      "Attendendo 3 secondi affinchè si carichi la pagina delle conditions..."
    );
    await driver.sleep(3000);

    // Esempio: Aprire la select nella 3a <td> e selezionare un'opzione
    console.log(
      "Iniziamo a selezionare le opzioni dalle select della tabella, apriamo la select della 3 colonna..."
    );
    await creationPage.selectMenuInRowByTdIndex(3); // Indice 3 per la terza <td>
    console.log("Select nella 3a TD aperta.");

    console.log("Cliccando sulla prima opzione desiderata...");
    await creationPage.clickMenuOptionByText(
      "urn:entities:heron_domxem3_244cab4356d1"
    );
    console.log("Opzione selezionata per la 3a TD.");

    await driver.sleep(2000);

    console.log("Aprendo la select nella 4a colonna (TD)...");
    await creationPage.selectMenuInRowByTdIndex(4);
    console.log("Select nella 4a TD aperta.");

    console.log("Cliccando sulla option desiderata per la 4a TD...");
    await creationPage.clickMenuOptionByText("energy_0");
    console.log("Opzione selezionata per la 4a TD.");

    await driver.sleep(2000);

    console.log("Aprendo la select nella 5a colonna (TD)...");
    await creationPage.selectMenuInRowByTdIndex(5);
    console.log("Select nella 5a TD aperta.");

    console.log("Cliccando sulla option desiderata per la 5a TD...");
    await creationPage.clickMenuOptionByText("==");
    console.log("Opzione selezionata per la 5a TD.");

    await driver.sleep(2000);

    // Interazione con il Text Field nella 6a Colonna
    console.log(
      "Iniziamo a inserire il valore nel text field della 6a colonna..."
    );
    // Chiamata al metodo: usa 6 come indice per la sesta <td> e il valore da inserire
    await creationPage.fillTextFieldInRowByTdIndex(6, "5");
    console.log("Valore inserito nel text field della 6a TD.");

    await driver.sleep(2000);

    //click sul bottone continue
    console.log(
      'Cliccando sul bottone "Continue" per andare al prossimo step...'
    );
    await creationPage.clickButtonByText("CONTINUE"); // Passa il testo esatto del bottone
    console.log('Bottone "Continue" cliccato.');

    await driver.sleep(3000);

    console.log(
      '--- Esecuzione dell\'azione "Webhook" con i parametri desiderati ---'
    );
    await creationPage.webhookAction({
      url: "https://www.urlprova.com",
    });
    console.log('Azione "Webhook" configurata e salvata.');

    await driver.sleep(3000);

    // CHIAMIAMO IL NUOVO METODO PER GESTIRE LA MODALE
    await creationPage.handleConfirmationModal();
    console.log("Modale di conferma gestita con successo.");

    await driver.sleep(3000);

    //click sul bottone continue
    console.log(
      'Cliccando sul bottone "Continue" per andare al prossimo step...'
    );
    await creationPage.clickButtonByText("CONTINUE"); // Passa il testo esatto del bottone
    console.log('Bottone "Continue" cliccato.');

    await driver.sleep(3000);

    //click sul bottone continue
    console.log('Cliccando sul bottone "Save" per salvare la regola.');
    await creationPage.clickButtonByText("SAVE"); // Passa il testo esatto del bottone
    console.log('Bottone "Save" cliccato.');

    await driver.sleep(6000);

    // FASE 4: Verifica della creazione della regola

    console.log(
      `Cercando la regola "${newRuleName}" per verificare la sua presenza.`
    );

    // Chiamata al metodo di ricerca
    await homePage.searchFor(newRuleName);
    await driver.sleep(2000); // Piccola pausa per la visualizzazione

    // Ottenere i risultati della ricerca
    const results = await homePage.getSearchResultsText();

    // Assert: verifica che almeno un risultato contenga il nome della regola
    const found = results.some((text) =>
      text.toLowerCase().includes(newRuleName.toLowerCase())
    );
    expect(found).to.be.true;

    console.log(
      `La regola "${newRuleName}" è stata trovata con successo. Test superato!`
    );
  });
});
