const { Builder, By, until } = require('selenium-webdriver');
const initHomePageSession = require('../helpers/initHomePageSession');
const CommonButton = require('../pages/common-button');

describe('Test chiusura modale con CANCEL e X', function () {
  this.timeout(30000);
  let driver;
  let commonButton;

  before(async () => {
    driver = await initHomePageSession();
    commonButton = new CommonButton(driver);
  });

  after(async () => {
    if (driver) await driver.quit();
  });

  it('dovrebbe aprire la modale e chiuderla con CANCEL e con la X', async () => {
    // 1. Clicca su "Create Rule"
    const createBtn = await driver.wait(
      until.elementLocated(By.css('.v-btn.v-btn--elevated.text-white')),
      5000
    );
    await createBtn.click();

    // 2. Chiudi la modale con CANCEL
    await commonButton.cancelModal();

    // 3. Aspetta la scomparsa della modale
    await commonButton.waitModalToDisappear();

    // 4. Riapri la modale
    const createBtn2 = await driver.wait(
      until.elementLocated(By.css('.v-btn.v-btn--elevated.text-white')),
      5000
    );
    await createBtn2.click();

    // 5. Chiudi la modale con la X
    await commonButton.closeWithX();

    // 6. Aspetta la scomparsa della modale
    await commonButton.waitModalToDisappear();

    // ✅ Log finale di conferma
    console.log('✅ Test cancelModal e chiusura con X riuscito');
  });
});
