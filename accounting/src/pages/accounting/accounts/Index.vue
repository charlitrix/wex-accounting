<template>
  <q-page class="q-pa-md">
    <q-tabs inline-label align="justify" v-model="tab">
      <q-tab no-caps icon="justify" name="listing" label="Listing" />
      <q-tab no-caps icon="add" name="create" label="Create" />
    </q-tabs>
    <q-tab-panels animated v-model="tab">
      <q-tab-panel name="listing">
        <div>
          <q-table
            flat
            :rows="tableRows"
            :columns="tableColumns"
            :loading="loadingData"
            no-data-label="No data available"
            loading-label="Loading data..."
            row-key="id"
            :pagination="{ rowsPerPage: 0 }"
          />
        </div>
      </q-tab-panel>
      <q-tab-panel name="create">
        <div class="q-px-xl q-pb-xl q-pt-lg column q-col-gutter-xl">
          <q-input v-model.trim="accountData.name" label="Name" type="text" />
          <q-input
            v-model.number="accountData.opening_balance"
            label="Opening balance"
            type="number"
          />
          <q-select
            :loading="loadingOptions"
            v-model="accountType"
            :options="accountTypesOptions"
            :option-label="(item) => item.name"
            :option-value="(item) => item.id"
            label="Type"
          />
          <div class="q-mt-md">
            <q-btn
              label="Submit"
              color="primary"
              class="full-width"
              :loading="creatingInfo"
              @click="confirmCreate"
            />
          </div>
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import { createAccount, getAccountTypes, getAccounts } from "src/boot/axios";
const columns = [
  {
    name: "id",
    label: "#",
    field: "id",
    align: "left",
    sortable: true,
  },
  {
    name: "name",
    label: "Name",
    field: "name",
    align: "left",
    sortable: true,
  },
  {
    name: "opening_balance",
    label: "Opening Balance",
    field: (row) =>
      `${row.opening_balance
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Ugx`,
    align: "left",
    sortable: true,
  },
  {
    name: "date",
    label: "Date",
    field: "date",
    align: "left",
    sortable: true,
  },
  {
    name: "type",
    label: "Type",
    field: (row) => row.account_type[0].name,
    align: "left",
    sortable: true,
  },
];
export default defineComponent({
  name: "AccountsIndex",
  data() {
    return {
      tab: ref("listing"),
      tableColumns: columns,
      tableRows: [],
      creatingInfo: ref(false),
      accountData: {},
      accountType: ref(),
      loadingData: ref(true),
      accountTypesOptions: [],
      loadingOptions: ref(true),
    };
  },
  methods: {
    confirmCreate() {
      this.$q
        .dialog({
          title: "Confirm ?",
          message: "Please confirm",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.creatingInfo = true;
          createAccount(this.accountType.id, { sub_account: this.accountData })
            .then((response) => {
              this.displayNotification(
                `Created ${response.data["name"]}.`,
                "blue"
              );
              this.loadingData = true;
              getAccounts()
                .then((response) => {
                  this.tableRows = response.data;
                })
                .finally(() => {
                  this.loadingData = false;
                });
            })
            .catch((error) => {
              this.displayNotification(
                `Server error, Please contact system administrator.`,
                "red"
              );
            })
            .finally(() => {
              this.creatingInfo = false;
              this.tab = "listing";
            });
        })
        .onCancel(() => {});
    },
  },
  mounted() {
    getAccountTypes()
      .then((response) => {
        this.accountTypesOptions = response.data;
      })
      .finally(() => {
        this.loadingOptions = false;
      });
    getAccounts()
      .then((response) => {
        this.tableRows = response.data;
      })
      .finally(() => {
        this.loadingData = false;
      });
  },
  setup() {
    const $q = useQuasar();

    return {};
  },
});
</script>
