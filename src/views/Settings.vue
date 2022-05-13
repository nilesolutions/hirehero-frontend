<template>
  <div class="dashboard__content">
    <h2 class="cursive-font black--text mb-2">Settings</h2>

    <v-tabs background-color="transparent" v-model="activeTab">
      <v-tab :disabled="!canSwitchTabs">Account</v-tab>
      <v-tab :disabled="!canSwitchTabs">Security</v-tab>
      <v-tab :disabled="!canSwitchTabs" v-if="showSubscriptionSection">Subscription</v-tab>
    </v-tabs>

    <v-tabs-items v-model="activeTab" class="setting-tabs">
      <v-tab-item key="accountSettings" class="account-tab">
        <account-management></account-management>
      </v-tab-item>

      <v-tab-item key="securitySettings" class="account-tab">
        <account-security></account-security>
      </v-tab-item>

      <v-tab-item key="subscriptionSettings" v-if="showSubscriptionSection">
        <subscription></subscription>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
import AccountManagement from "@/components/settings/AccountManagement.vue";
import AccountSecurity from "@/components/settings/AccountSecurity.vue";
import SubscriptionManagement from "@/components/settings/SubscriptionManagement.vue";
import Subscription from "@/views/Subscription.vue";

import { useSubscription } from "@/composables/user/subscription";
import { computed } from "@vue/composition-api";
import { useUser } from "@/composables/user/user";

export default {
  name: "Settings",
  components: {
    AccountManagement,
    AccountSecurity,
    SubscriptionManagement,
    Subscription,
  },
  setup() {
    const { isCheckingOut, isUpdatingPlan, isUpdatingPayment } = useSubscription();
    const { userType } = useUser();

    const canSwitchTabs = computed(() => {
      if (isCheckingOut.value || isUpdatingPlan.value || isUpdatingPayment.value) return false;
      return true;
    });

    const showSubscriptionSection = computed(() => {
      if (userType.value == "client") return true;
      return false;
    });

    return {
      activeTab: null,
      canSwitchTabs,
      showSubscriptionSection,
    };
  },
};
</script>

<style>
.setting-tabs {
  background-color: transparent !important;
}

.account-tab {
  background-color: #fff;
  padding: 2rem;
}
</style>
