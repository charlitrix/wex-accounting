<template>
  <q-layout view="hHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title> Wex </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" bordered>
      <q-scroll-area class="fit">
        <q-list padding>
          <q-expansion-item
            :header-inset-level="0.5"
            :content-inset-level="1"
            default-opened
            label="Accounting"
          >
            <q-list>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>Chart of Accounts</q-item-label>
                </q-item-section>
              </q-item>
              <q-expansion-item
                default-opened
                expand-separator
                :content-inset-level="1"
                label="Accounts"
              >
                <q-list>
                  <q-item clickable v-ripple :to="{ name: 'AccountsIndex' }">
                    <q-item-section>
                      <q-item-label>Accounts</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
              <q-expansion-item
                default-opened
                expand-separator
                :content-inset-level="1"
                label="Ledgers"
              >
                <q-list>
                  <q-item clickable v-ripple :to="{ name: 'LedgersIndex' }">
                    <q-item-section>
                      <q-item-label>Ledgers</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple>
                    <q-item-section>
                      <q-item-label>Ledgers</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>

              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>Expenses</q-item-label>
                </q-item-section>
              </q-item>
              <q-expansion-item :content-inset-level="1" label="Budget">
                <q-list>
                  <q-item clickable v-ripple>
                    <q-item-section>
                      <q-item-label>Draft</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-ripple>
                    <q-item-section>
                      <q-item-label>Final</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
              <q-separator />
              <q-expansion-item
                icon="settings"
                :content-inset-level="1"
                label="Settings"
              >
                <q-list>
                  <q-item clickable v-ripple :to="{ name: 'GeneralSettings' }">
                    <q-item-section>
                      <q-item-label>General Settings</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-ripple
                    :to="{ name: 'AccountTypesIndex' }"
                  >
                    <q-item-section>
                      <q-item-label>Account Types</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-expansion-item>
            </q-list>
          </q-expansion-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from "components/EssentialLink.vue";

import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "MainLayout",

  components: {},
  data() {
    return {
      leftDrawerOpen: ref(true),
    };
  },

  setup() {
    return {};
  },
});
</script>
