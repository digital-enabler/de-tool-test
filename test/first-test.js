// test/first-test.js (CORRETTO)
const { setupdriver } = require('../utils/driver'); 

(async function firsttest() { 
  let driver; 

  try { 
    // Inizializza il driver 
    console.log('Inizializzazione del driver...'); 
    driver = await setupdriver(); 

    // Apri un sito web 
    console.log('Apertura del sito web...'); 
    await driver.get('https://rules.avant.digital-enabler.eng.it/rules'); 

    // Ottieni e stampa il titolo della pagina 
    const title = await driver.getTitle();
    console.log(`Titolo della pagina: ${title}`); 

    console.log('Test completato con successo!'); 

  } catch (error) { 
    console.error('Si è verificato un errore:', error); 
  } finally { 
    // Chiudi il browser 
    if (driver) { 
      console.log('Chiusura del browser...'); 
      await driver.quit(); 
    } 
  } 
})();