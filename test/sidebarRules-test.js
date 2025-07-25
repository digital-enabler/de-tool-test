const { expect } = require('chai');
const initHomePageSession = require('../helpers/initHomePageSession');

describe('Sidebar Rules Visibility Test', function () {
  this.timeout(30000);

  let driver;
  let homePage;

  before(async function () {
    const session = await initHomePageSession();
    driver = session.driver;
    homePage = session.homePage;
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it('should open sidebar and find the "Rules" section', async function () {
    // Clic sul menu
    const menuIcon = await driver.findElement(homePage.sidebarMenuButton);
    await menuIcon.click();

    // Aspetta l’elemento "Rules"
    const rulesItem = await driver.wait(async () => {
      const elements = await driver.findElements(homePage.sidebarRulesItem);
      for (const el of elements) {
        const text = await el.getText();
        if (text.toLowerCase() === 'rules') {
          return el;
        }
      }
      return false;
    }, 5000);

    // Verifica visibilità
    const isDisplayed = await rulesItem.isDisplayed();
    expect(isDisplayed).to.be.true;
  });
});
