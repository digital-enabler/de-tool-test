import dotenv from "dotenv";
dotenv.config();

export const USERNAME = process.env.KEYCLOAK_USERNAME ?? "username-test";
export const PASSWORD = process.env.KEYCLOAK_PASSWORD ?? "password-test";
export const LOGIN_URL = process.env.LOGIN_URL ?? "url-rule-manager";
