// common-button.js
const { By, until } = require('selenium-webdriver');

class CommonButton {
  constructor(driver) {
    this.driver = driver;
  }

  async cancelModal() {
    const buttons = await this.driver.findElements(
      By.css('button.v-btn.v-btn--slim.v-theme--light.v-btn--density-default.v-btn--size-default.v-btn--variant-text')
    );

    for (let btn of buttons) {
      const text = await btn.getText();
      if (text.trim().toUpperCase() === 'CANCEL') {
        await btn.click();
        return;
      }
    }

    throw new Error('Pulsante CANCEL nella modale non trovato');
  }

  async cancelPage() {
    const buttons = await this.driver.findElements(
      By.css('button.v-btn.v-btn--slim.v-theme--light.text-secondary.v-btn--density-default.v-btn--size-default.v-btn--variant-outlined')
    );

    for (let btn of buttons) {
      const text = await btn.getText();
      if (text.trim().toUpperCase() === 'CANCEL') {
        await btn.click();
        return;
      }
    }

    throw new Error('Pulsante CANCEL nella pagina non trovato');
  }

  async cancelField() {
    const buttons = await this.driver.findElements(
      By.css('button.v-btn.v-btn--slim.v-theme--light.text-secondary.v-btn--density-default.rounded-xl.v-btn--size-small.v-btn--variant-outlined.ml-2')
    );

    for (let btn of buttons) {
      const text = await btn.getText();
      if (text.trim().toUpperCase() === 'CANCEL') {
        await btn.click();
        return;
      }
    }

    throw new Error('Pulsante CANCEL per svuotare i campi non trovato');
  }

  async closeWithX() {
    const buttons = await this.driver.findElements(
      By.css('button.v-btn.v-theme--light.text-white.v-btn--density-default.v-btn--size-default.v-btn--variant-text')
    );

    for (let btn of buttons) {
      const text = await btn.getText();
      if (text.trim().toUpperCase() === 'X') {
        await btn.click();
        return;
      }
    }

    throw new Error('Pulsante X per chiusura modale non trovato');
  }

  async waitModalToDisappear() {
    await this.driver.wait(async () => {
      const overlays = await this.driver.findElements(By.css('.v-overlay-container'));
      for (let overlay of overlays) {
        if (await overlay.isDisplayed()) return false;
      }
      return true;
    }, 5000);
  }
}

module.exports = CommonButton;
