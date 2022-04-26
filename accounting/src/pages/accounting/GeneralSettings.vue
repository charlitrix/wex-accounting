<template>
  <q-page class="q-pa-xl">
    <div class="q-mb-lg">
      <div class="text-h5">Fiscal Year</div>
      <div class="q-px-md row q-col-gutter-x-xl q-mb-lg">
        <q-input readonly v-model="formattedFromDate" label="From date">
          <template v-slot:append>
            <q-icon name="event" :disabled="disableSave" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
                ref="fromDateProxy"
              >
                <q-date
                  v-model="fromDate"
                  mask="YYYY-MM-DD"
                  @update:model-value="fromDateChanged"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input readonly v-model="formattedToDate" label="To date">
          <template v-slot:append>
            <q-icon name="event" :disabled="disableSave" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
                ref="toDateProxy"
              >
                <q-date
                  v-model="toDate"
                  mask="YYYY-MM-DD"
                  @update:model-value="toDateChanged"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <div class="column justify-center">
          <q-btn
            color="primary"
            label="Save"
            :disable="disableSave"
            :loading="savingFiscalYear"
            @click="saveFiscalYear"
          />
        </div>
      </div>
      <q-separator />
    </div>
    <div class="text-subtitle1 q-mb-lg">
      These settings determine how the transactions of the differenct accounts
      will be handled
    </div>
    <div class="q-mb-md">
      <div class="text-h5">Items Classfication and Categorization</div>
      <div class="q-px-md">
        <div class="text-body2">
          Items with in the financial transactions have to be uniquely
          identified
        </div>
        <q-option-group
          :options="itemCategorizationOptions"
          v-model="itemCategorization"
          type="checkbox"
        />
      </div>
    </div>
    <div class="q-mb-lg">
      <div class="text-h5">Financial Records entry</div>
      <div class="q-px-md">
        <q-option-group
          :options="financialRecordEntryOptions"
          v-model="financialRecordEntry"
          type="checkbox"
        />
      </div>
    </div>
    <q-btn
      label="Save"
      class="full-width"
      color="primary"
      @click="confirmUpdate"
      :loading="savingContent"
    />
  </q-page>
</template>
<script>
import { defineComponent, ref } from "vue";
import { useQuasar, date } from "quasar";
import {
  getAccountingSettings,
  createAccountingSettings,
  getCurrentFiscalYear,
  createFiscalYear,
} from "src/boot/axios";

export default defineComponent({
  name: "GeneralSettings",
  data() {
    const today = new Date();
    return {
      disableSave: ref(true),
      fromDate: ref(date.formatDate(today, "YYYY-MM-DD")),
      toDate: ref(
        date.formatDate(
          date.addToDate(today, { months: 12, days: -1 }),
          "YYYY-MM-DD"
        )
      ),
      savingContent: ref(false),
      savingFiscalYear: ref(false),
      itemCategorizationOptions: [
        { label: "Use Budget plan", value: "use_budget_plan" },
      ],
      itemCategorization: ref([]),

      financialRecordEntry: ref(["use_ledgers"]),
      financialRecordEntryOptions: [
        {
          label: "Use Ledgers for records entry. ",
          value: "use_ledgers",
          disable: true,
        },
        { label: "Use Vote Book for expenses", value: "use_vote_book" },
        {
          label: "Use Cash analysis for receipts and payments",
          value: "use_cash_analysis",
        },
      ],
    };
  },
  computed: {
    formattedFromDate() {
      return date.formatDate(
        date.extractDate(this.fromDate, "YYYY-MM-DD"),
        "DD/MM/YYYY"
      );
    },
    formattedToDate() {
      return date.formatDate(
        date.extractDate(this.toDate, "YYYY-MM-DD"),
        "DD/MM/YYYY"
      );
    },
  },
  methods: {
    fromDateChanged(value) {
      const newDate = date.extractDate(value, "YYYY-MM-DD");

      this.toDate = date.formatDate(
        date.addToDate(newDate, { months: 12, days: -1 }),
        "YYYY-MM-DD"
      );
      this.$refs.fromDateProxy.hide();
    },
    toDateChanged(value) {
      const newDate = date.extractDate(value, "YYYY-MM-DD");

      this.fromDate = date.formatDate(
        date.subtractFromDate(newDate, { months: 12, days: -1 }),
        "YYYY-MM-DD"
      );
      this.$refs.toDateProxy.hide();
    },
    saveFiscalYear() {
      this.$q
        .dialog({
          title: "Confirm ?",
          message:
            "Please confirm the dates before pressing okay. Once fiscal year is set it cannot be changed.",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          this.savingFiscalYear = true;
          createFiscalYear({
            start: this.fromDate,
            end: this.toDate,
          })
            .then((response) => {
              if (response.status == 201) {
                this.disableSave = true;
                this.displayNotification("Fiscal year has been set", "blue");
              }
            })
            .catch((error) => {
              console.log(error.response);
              this.displayNotification(
                "Server error, Please contact system administrator.",
                "red"
              );
            })
            .finally(() => {
              this.savingFiscalYear = false;
            });
        })
        .onCancel(() => {});
    },
    confirmUpdate() {
      this.$q
        .dialog({
          title: "Confirm ?",
          message: "Please confirm",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          var data = [];
          data.push({
            item: "ITEMS_SPECIFICATION",
            additional_data: this.itemCategorization,
          });

          data.push({
            item: "FINANCIAL_DOCUMENTS",
            additional_data: this.financialRecordEntry,
          });
          this.savingContent = true;
          createAccountingSettings({
            data: data,
          })
            .then((response) => {
              this.displayNotification("Settings have been set.", "blue");
            })
            .catch((error) => {
              this.displayNotification(
                `Server error, Please contact system administrator.`,
                "red"
              );
            })
            .finally(() => {
              this.savingContent = false;
            });
        })
        .onCancel(() => {});
    },
  },
  mounted() {
    getCurrentFiscalYear()
      .then((response) => {
        this.fromDate = response.data.start;
        this.toDate = response.data.end;
      })
      .catch((error) => {
        if (error.response.status == 404) {
          this.disableSave = false;
        }
      })
      .finally(() => {
        getAccountingSettings().then((response) => {
          response.data.forEach((e) => {
            if (e["item"] == "ITEMS_SPECIFICATION") {
              this.itemCategorization = e["additional_data"];
            }
            if (e["item"] == "FINANCIAL_DOCUMENTS") {
              this.financialRecordEntry = e["additional_data"];
            }
          });
        });
      });
  },
  setup() {
    const $q = useQuasar();

    return {};
  },
});
</script>
