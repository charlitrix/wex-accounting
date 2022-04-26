const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Index.vue"),
      },
      {
        path: "general-settings",
        name: "GeneralSettings",
        component: () => import("pages/accounting/GeneralSettings.vue"),
      },
      {
        path: "account-types",
        name: "AccountTypesIndex",
        component: () => import("pages/accounting/accountTypes/Index.vue"),
      },
      {
        path: "accounts",
        name: "AccountsIndex",
        component: () => import("pages/accounting/accounts/Index.vue"),
      },
      {
        path: "ledgers",
        name: "LedgersIndex",
        component: () => import("pages/accounting/ledgers/Index.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
