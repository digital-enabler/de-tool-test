const { By, until } = require("selenium-webdriver");

async function logoutUser(driver) {
  const profileMenuSelector = By.css(".v-avatar");
  await driver.wait(until.elementLocated(profileMenuSelector), 10000);
  const profileMenu = await driver.findElement(profileMenuSelector);
  await driver.wait(until.elementIsVisible(profileMenu), 5000);
  await profileMenu.click();

  const logoutButtonSelector = By.xpath("//div[contains(text(),'Logout')]");

  await driver.sleep(1000);
  await driver.wait(until.elementLocated(logoutButtonSelector), 10000);

  await driver.sleep(1000);

  const logoutButton = await driver.findElement(logoutButtonSelector);
  await logoutButton.click();
}

module.exports = logoutUser;
