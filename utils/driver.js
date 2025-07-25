// utils/driver.js (CORRETTO)
const { Builder } = require('selenium-webdriver'); // Builder con la B maiuscola!
const chrome = require('selenium-webdriver/chrome');
require('chromedriver'); // Questo è sufficiente: viene incluso e lanciato con la versione giusta

// Funzione per configurare e restituire il driver 
async function setupdriver() {
  // Configurazioni del browser 
  const options = new chrome.Options(); // Options con la O maiuscola!

  options.addArguments('--ignore-certificate-errors');

  // Opzioni per cancellare cache
  // Opzioni aggiuntive (decommentare se necessario) 
  // options.addArguments('--headless'); // addArguments non addarguments
  // options.addArguments('--window-size=1920,1080'); 
  // options.addArguments('--disable-gpu'); 
  // options.addArguments('--no-sandbox'); 

  // Costruisci e restituisci il driver 
  const driver = await new Builder() // Builder non builder
    .forBrowser('chrome') // forBrowser non forbrowser
    .setChromeOptions(options) // setChromeOptions non setchromeoptions
    .build(); 
  return driver; 
} 

module.exports = { setupdriver };
