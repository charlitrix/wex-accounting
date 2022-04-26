<template>
  <q-page class="q-pa-md">
    <div class="text-overline">
      These settings determine how the transactions of the differenct accounts
      will be handled
    </div>
    <div>
      <div class="text-h3">Items Classfication and Categorization</div>
      <div class="q-px-md">
        <div class="text-body2">
          Items with in the financial transactions have to be uniquely
          identified
        </div>
        <q-option-group
          options="itemCategorizationOptions"
          v-model="itemCategorization"
        />
      </div>
    </div>
    <div>
      <div class="text-h3">Financial Records entry</div>
      <div class="q-px-md">
        <q-option-group
          options="financialRecordEntryOptions"
          v-model="financialRecordEntry"
          type="checkbox"
        />
      </div>
    </div>
  </q-page>
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "ChartOfAccounts",
  data() {
    return {};
  },
});
</script>
