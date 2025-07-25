const { setupdriver } = require("../utils/driver");
const LoginPage = require("../pages/login-page");

/*
Logs in with valid credentials and returns the driver and login page to be used in subsequent tests (e.g. homepage) */
async function loginWithValidCredentials() {
  const driver = await setupdriver();
  const loginPage = new LoginPage(driver);

  const LOGIN_URL =
    "https://idm.digital-enabler.eng.it/auth/realms/avant/protocol/openid-connect/auth?response_type=code&client_id=rule-app&redirect_uri=https://rm-middleware-api.core.digital-enabler.eng.it/api/v1/avant/auth/callback";

  const validUsername = "<USERNAME>";
  const validPassword = "<PASSWORD>";

  await loginPage.open(LOGIN_URL);
  await loginPage.login(validUsername, validPassword);

  return { driver, loginPage };
}

module.exports = { loginWithValidCredentials };
