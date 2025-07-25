const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
require("chromedriver");

// Function to configure and return the driver
async function setupdriver() {
  // Browser Configurations
  const options = new chrome.Options(); // Options con la O maiuscola!

  options.addArguments("--ignore-certificate-errors");

  // Options for clearing cache
  // Additional options (uncomment if necessary)
  // options.addArguments('--headless');
  // options.addArguments('--window-size=1920,1080');
  // options.addArguments('--disable-gpu');
  // options.addArguments('--no-sandbox');

  // Build and return driver
  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();
  await driver.manage().window().maximize();
  return driver;
}

module.exports = { setupdriver };
