const { setupdriver } = require("../utils/driver");
const LoginPage = require("../pages/login-page");
const { USERNAME, PASSWORD, LOGIN_URL } = require("../utils/constants");

async function loginWithValidCredentials() {
    const driver = await setupdriver();
    const loginPage = new LoginPage(driver);

    await loginPage.open(LOGIN_URL);
    await loginPage.login(USERNAME, PASSWORD);

    return { driver, loginPage };
}

module.exports = { loginWithValidCredentials };
