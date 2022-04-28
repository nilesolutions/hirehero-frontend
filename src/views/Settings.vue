<template>
  <div class="dashboard__content">
    <h2 class="cursive-font black--text mb-2">Settings</h2>

    <account-management></account-management>

    <!-- <v-tabs background-color="transparent" v-model="activeTab">
      <v-tab>Account</v-tab>
      <v-tab>Subscription</v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeTab">
      <v-tab-item class="px-2 py-2">
        
      </v-tab-item>

      <v-tab-item>
        <subscription-management></subscription-management>
      </v-tab-item>
    </v-tabs-items> -->
  </div>
</template>

<script>
import AccountManagement from "@/components/settings/AccountManagement.vue";
import SubscriptionManagement from "@/components/settings/SubscriptionManagement.vue";

export default {
  name: "Settings",
  components: {
    AccountManagement,
    SubscriptionManagement,
  },
  setup() {
    return {
      activeTab: null,
    };
  },
};
</script>

<style></style>
