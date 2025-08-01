const { describe, it, before, after } = require("mocha");
const { expect } = require("chai");
const { loginWithValidCredentials } = require("../helpers/auth");
const HomePage = require("../pages/home-page");
const { Builder, By, until } = require("selenium-webdriver");

describe("Home Page Access After Login", function () {
  this.timeout(30000);

  let driver;
  let homePage;

  before(async function () {
    const loginSession = await loginWithValidCredentials();
    driver = loginSession.driver;
    homePage = new HomePage(driver);
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it("should display the correct title in the home page", async function () {
    await driver.wait(until.urlContains("/rules"), 10000);
    const currentUrl = await driver.getCurrentUrl();
    expect(currentUrl).to.include("/rules");

    await driver.wait(until.elementLocated(homePage.title), 10000);
    const titleText = await homePage.getTitleText();
    console.log("🏷️ Titolo trovato:", titleText);
  });
});
