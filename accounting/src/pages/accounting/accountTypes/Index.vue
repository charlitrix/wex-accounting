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
          <q-input
            v-model.trim="accountTypeData.name"
            label="Name"
            type="text"
          />
          <q-select
            v-model="accountTypeData.increase"
            :options="increaseOptions"
            :option-label="(item) => item.label"
            :option-value="(item) => item.value"
            label="Increases By"
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
import { createAccountTypes, getAccountTypes } from "src/boot/axios";
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
    name: "increase",
    label: "Increase",
    field: "increase",
    align: "left",
    sortable: true,
  },
];
export default defineComponent({
  name: "AccountTypesIndex",
  data() {
    return {
      tab: ref("listing"),
      tableColumns: columns,
      tableRows: [],
      creatingInfo: ref(false),
      accountTypeData: {},
      loadingData: ref(true),
      increaseOptions: [
        { label: "debit", value: "DEBIT" },
        { label: "credit", value: "CREDIT" },
      ],
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
          this.accountTypeData.increase = this.accountTypeData.increase.value;
          createAccountTypes(this.accountTypeData)
            .then((response) => {
              this.displayNotification(
                `Created ${response.data["name"]}.`,
                "blue"
              );
              this.accountTypeData = {};
              this.loadingData = true;
              getAccountTypes()
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
