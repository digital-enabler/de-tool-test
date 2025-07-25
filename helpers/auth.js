const { setupdriver } = require('../utils/driver');
const LoginPage = require('../pages/login-page');

/*
Esegue il login con credenziali valide e restituisce il driver e la pagina di login da utilizzare nei test successivi (es. homepage)
 */
async function loginWithValidCredentials() {
  const driver = await setupdriver();
  const loginPage = new LoginPage(driver);

  const LOGIN_URL = 'https://idm.digital-enabler.eng.it/auth/realms/avant/protocol/openid-connect/auth?response_type=code&client_id=rule-app&redirect_uri=https://rm-middleware-api.core.digital-enabler.eng.it/api/v1/avant/auth/callback';

  const validUsername = 'nicolo.romano';  
  const validPassword = 'ciao123';

  await loginPage.open(LOGIN_URL);
  await loginPage.login(validUsername, validPassword);

  return { driver, loginPage };
}

module.exports = { loginWithValidCredentials };

