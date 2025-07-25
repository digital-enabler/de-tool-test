const { expect } = require("chai");
const { By, until, Key } = require("selenium-webdriver");
const initHomePageSession = require("../helpers/initHomePageSession");
const RuleCreationPage = require("../pages/rule-creation-pages");

describe("Create Rule Webhook Test", function () {
  this.timeout(60000); // General timeout of entire test
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

    // 1. Click on "Create Rule" button
    console.log('Cercando il bottone "Create Rule"...');
    const createBtn = await driver.wait(
      until.elementLocated(By.css(".v-btn.v-btn--elevated.text-white")),
      10000
    );
    await driver.wait(until.elementIsVisible(createBtn), 5000);
    await driver.wait(until.elementIsEnabled(createBtn), 5000);
    await createBtn.click();
    console.log('Cliccato su "Create Rule".');

    // Wait until the rule creation modal is visible and ready
    console.log('Attendendo che la modale "Crea Nuova Regola" sia visibile...');
    const modalTitleElement = await driver.wait(
      until.elementLocated(By.css(".v-toolbar-title__placeholder")),
      10000
    );
    await driver.wait(until.elementIsVisible(modalTitleElement), 5000);
    console.log('Modale "Crea Nuova Regola" è visibile e pronta.');

    // 2. Write the name of the new rule
    const newRuleName = "Test Regola Automatica Webhook";
    console.log(`Compilando il nome della regola: ${newRuleName}`);
    await creationPage.fillRuleName(newRuleName);
    console.log("Nome regola compilato.");

    // 3. Select option from select (this action occurs within the modal itself)
    console.log("Aprendo la select...");
    await creationPage.selectMenu("OptionVisibleText");
    console.log("Select menu aperta.");

    console.log("Cliccando sulla option...");
    await creationPage.clickMenuOptionByText("avant");
    console.log("Option selezionata.");

    console.log('Cliccando sul bottone "Salva" (prima fase)...');
    await creationPage.clickSave();

    // Waiting for the modal to close and the next page to load
    console.log(
      "Attendendo 3 secondi per la chiusura della modale e il caricamento della pagina successiva..."
    );
    await driver.sleep(3000);

    // Click on asset card
    console.log("Cliccando sulla card in base al testo...");
    await creationPage.clickCardByText("NGSI ENTITY");
    console.log("Card cliccata.");

    // Waiting for asset list to load
    console.log(
      "Attendendo 3 secondi affinchè la lista si carichi correttamente..."
    );
    await driver.sleep(3000);

    // Click on arrow of asset list
    console.log(
      "Procedendo con il prossimo passo cliccando sul bottone freccia..."
    );
    await creationPage.clickRightArrowButton();
    console.log("Bottone freccia cliccato.");

    // Waiting for the selected asset to appear in the list
    console.log(
      "Attendendo 3 secondi affinchè la lista degli asset selezionati si carichi correttamente..."
    );
    await driver.sleep(3000);

    console.log(
      'Cliccando sul bottone "Continue" per andare al prossimo step...'
    );
    await creationPage.clickButtonByText("CONTINUE");
    console.log('Bottone "Continue" cliccato.');

    // Waiting for the conditions page to load
    console.log(
      "Attendendo 3 secondi affinchè si carichi la pagina delle conditions..."
    );
    await driver.sleep(3000);

    // Example: Open the select in the 3rd <td> and select an option
    console.log(
      "Iniziamo a selezionare le opzioni dalle select della tabella, apriamo la select della 3 colonna..."
    );
    await creationPage.selectMenuInRowByTdIndex(3); // Index 3 for the third <td>
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

    // Interaction with the Text Field in the 6th Column
    console.log(
      "Iniziamo a inserire il valore nel text field della 6a colonna..."
    );
    // Method call: use 6 as index for the sixth <td> and the value to be entered
    await creationPage.fillTextFieldInRowByTdIndex(6, "5");
    console.log("Valore inserito nel text field della 6a TD.");

    await driver.sleep(2000);

    console.log(
      'Cliccando sul bottone "Continue" per andare al prossimo step...'
    );
    await creationPage.clickButtonByText("CONTINUE");
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

    // Handling modal
    await creationPage.handleConfirmationModal();
    console.log("Modale di conferma gestita con successo.");

    await driver.sleep(3000);

    console.log(
      'Cliccando sul bottone "Continue" per andare al prossimo step...'
    );
    await creationPage.clickButtonByText("CONTINUE");
    console.log('Bottone "Continue" cliccato.');

    await driver.sleep(3000);

    console.log('Cliccando sul bottone "Save" per salvare la regola.');
    await creationPage.clickButtonByText("SAVE");
    console.log('Bottone "Save" cliccato.');

    await driver.sleep(6000);

    // Verification of Rule Creation

    console.log(
      `Cercando la regola "${newRuleName}" per verificare la sua presenza.`
    );

    // Calling the search method
    await homePage.searchFor(newRuleName);
    await driver.sleep(2000);

    // Obtaining search results
    const results = await homePage.getSearchResultsText();

    // Checks that at least one result contains the name of the rule
    const found = results.some((text) =>
      text.toLowerCase().includes(newRuleName.toLowerCase())
    );
    expect(found).to.be.true;

    console.log(
      `La regola "${newRuleName}" è stata trovata con successo. Test superato!`
    );
  });
});
