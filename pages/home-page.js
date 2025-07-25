const { By, until } = require('selenium-webdriver');
const BasePage = require('./base-page');
const { Key } = require('selenium-webdriver')

class HomePage extends BasePage {
  constructor(driver) {
    super(driver);
    this.title = By.css('.text-primary.text-h5.font-weight-bold'); //titolo pagina (rules)
    this.searchInput = By.id('input-v-1'); //input searchbar
    this.searchResultItem = By.css('.v-data-table__tr'); //prendi risultati dalla tabella
    this.selectionCheckbox = By.id('input-v-4'); //selection generale
    this.deleteIcon = By.css('.mdi-delete.mdi.v-icon.notranslate.v-theme--light.v-icon--size-default.text-secondary.v-icon--clickable.d-inline-block.ml-2'); //delete icon accanto selection icon sopra la tabella
    this.firstRowCheckbox = By.css('tbody tr:first-child td.v-data-table__td--select-row .v-selection-control'); //selection singola riga
    this.firstRowThreeDotMenu = By.css('tbody tr:first-child .mdi-dots-vertical.mdi.v-icon.notranslate.v-theme--light.v-icon--size-default'); //menu a tre pallini prima riga
    this.menuOptions = By.css('.v-list-item-title'); //opzioni menu
    this.renameInput = By.name('ruleName'); //rename input in base al nome (rename)
    this.renameButton = By.css('.v-btn.v-btn--slim.v-theme--light.text-secondary.darken-1.v-btn--density-default.v-btn--size-default.v-btn--variant-text'); //rename button
    this.sidebarMenuButton = By.css('.mdi-menu.mdi.v-icon.notranslate.v-theme--light.v-icon--size-x-large.text-secondary'); //sidebar button burger icon
    this.sidebarRulesItem = By.css('.v-list-item-title.text-white.text-uppercase'); //click sulla sezione rules della sidebar

  }

  //metodo per cercare e prendere il titolo
  async getTitleText() {
    const element = await this.driver.findElement(this.title);
    return await element.getText();
  }

//metodo per la ricerca in searchbar, utilizzato anche come conferma dopo le operazioni nel three-dot menu
async searchFor(term) {
  try {
    // 2. Aspetta l'input reale
    const searchInput = await this.driver.wait(
      until.elementLocated(this.searchInput),
      5000
    );
    await searchInput.click();

    //pausa breve dopo il click per vedere l'input
    await this.driver.sleep(1000);

    // 3. Scrivi
    await searchInput.sendKeys(term);

    //pausa per vedere la scrittura
    await this.driver.sleep(1000);

    // 4. Aspetta i risultati
    await this.driver.wait(
      until.elementLocated(this.searchResultItem),
      5000
    );

    //pausa per vedere i risultati comparire
    await this.driver.sleep(2000);
  } catch (e) {
    console.error('Errore in searchFor:', e);
    throw e;
  }
}

//metodo per prendere i risultati frutto della ricerca
  async getSearchResultsText() {
    const results = await this.driver.findElements(this.searchResultItem);
    const texts = [];
    for (const el of results) {
      texts.push(await el.getText());
    }
    return texts;
  }

  //selection icon
  async clickSelectionCheckbox() {
  const checkbox = await this.driver.wait(
    until.elementLocated(this.selectionCheckbox),
    5000
  );
  await checkbox.click();
}

//delete icon dopo aver cliccato sulla selection icon
async isDeleteIconVisible() {
  try {
    const icon = await this.driver.wait(
      until.elementLocated(this.deleteIcon),
      5000
    );
    return await icon.isDisplayed();
  } catch (e) {
    return false;
  }
}

//click selection icon singola riga
async clickFirstRowCheckbox() {
  const checkbox = await this.driver.findElement(this.firstRowCheckbox);
  await checkbox.click();
  await this.driver.sleep(1500);
}

//per il click sui tre puntini per le opzioni
async clickFirstRowThreeDotMenu() {
  const menuButton = await this.driver.findElement(this.firstRowThreeDotMenu);
  await menuButton.click();
}

//click sulla prima opzione basato sul testo perchè hanno tutti la stessa classe
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

//per la scrittura del nuovo nome della regola;
async fillRenameInput(newName) {
  const input = await this.driver.findElement(this.renameInput);
  // Seleziona tutto e cancella il testo precedente
  await input.sendKeys(Key.chord(Key.CONTROL, 'a'), Key.BACK_SPACE);
  // Scrivi il nuovo nome
  await input.sendKeys(newName);
}

//per il click sul tasto rename
async clickRenameButton() {
  const button = await this.driver.findElement(this.renameButton);
  await this.driver.sleep(1500);
  await button.click();
}

//metodo per cliccare sul tasto in base al testo, quindi per evitare ogni volta l'identificazione tramite classe o id
async clickButtonByText(text) {
  // Aspetta che almeno un bottone sia presente
  await this.driver.wait(async () => {
    const buttons = await this.driver.findElements(By.css('button'));
    return buttons.length > 0;
  }, 5000);

  // Prendi tutti i bottoni e cerca quello con il testo giusto
  const buttons = await this.driver.findElements(By.css('button'));
  for (const button of buttons) {
    const btnText = await button.getText();
    if (btnText.trim().toLowerCase() === text.toLowerCase()) {
      await button.click();
      return;
    }
  }

  throw new Error(`Button with text "${text}" not found`);
}

//prendiamo il nome della prima riga della tabella
async getFirstRowName() {
  // Aspetta che la prima riga sia presente
  const firstRowNameElement = await this.driver.wait(
    until.elementLocated(By.css('tbody tr:first-child td:nth-child(2)')),
    5000
  );
  // Prendi il testo e restituiscilo
  return await firstRowNameElement.getText();
}

//metodo per quando voglio che la ricerca tramite searchbar non dia risultati tipo per la delete
async searchForAllowingNoResults(term) {
  try {
    const searchInput = await this.driver.wait(
      until.elementLocated(this.searchInput),
      5000
    );
    await searchInput.click();
    await searchInput.sendKeys(term);

    // Attendi per permettere il caricamento dei (non-)risultati
    await this.driver.sleep(1500);
  } catch (e) {
    console.error('Errore in searchForAllowingNoResults:', e);
    throw e;
  }
}


/*
//per cliccare sui tre pallini di una riga qualsiasi e non per forza la prima
async clickThreeDotMenuByRuleName(ruleName) {
  const rows = await this.driver.findElements(this.searchResultItem);
  for (const row of rows) {
    const text = await row.getText();
    if (text.toLowerCase().includes(ruleName.toLowerCase())) {
      const menuButton = await row.findElement(By.css('.mdi-dots-vertical.mdi.v-icon.notranslate.v-theme--light.v-icon--size-default'));
      await menuButton.click();
      return;
    }
  }
  throw new Error(`No row found with rule name containing "${ruleName}"`);
}*/


}

module.exports = HomePage;