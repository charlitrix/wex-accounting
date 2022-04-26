import { boot } from "quasar/wrappers";
import axios from "axios";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({
  baseURL: "/accounting",
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

function getAccountingSettings() {
  return api.get("/settings/");
}
function createAccountingSettings(data) {
  return api.post("/settings/", data);
}

function getAccountTypes() {
  return api.get("/account-types/");
}
function createAccountTypes(data) {
  return api.post("/account-types/", data);
}

function getCurrentFiscalYear() {
  return api.get("/fiscal-year/current/");
}

function createFiscalYear(data) {
  return api.post("/fiscal-year/", data);
}

function createAccount(id, data) {
  return api.post("/accounts/" + id, data);
}

function getAccounts() {
  return api.get("/accounts/");
}

export {
  api,
  getAccountingSettings,
  createAccountingSettings,
  getAccountTypes,
  createAccountTypes,
  getCurrentFiscalYear,
  createFiscalYear,
  createAccount,
  getAccounts,
};
